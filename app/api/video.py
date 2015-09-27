from threading import Thread
import time
import json
import logging
import datetime
import random
from app import db
from app.models import Video
from .youtube import youtube_search

logging.getLogger("werkzeug").setLevel(logging.WARNING)

class VideoTracker:

    __object = None

    @staticmethod
    def getObject():
        if not VideoTracker.__object:
            VideoTracker.__object = VideoTracker()
        return VideoTracker.__object

    def __init__(self):

        self.queue = self.VideoQueue()

        self.currentVideo = None

        self.ip_list = set()
        self.skip_list = set()
        self.skip_thresh = 0.5
        self.start_time = time.time()
        self.last_was_skipped = False

    def get_video(self, ip):
        if not self.currentVideo:
            self.next_video()

        if self.running_time() >= self.currentVideo[1]:
            self.next_video()
            self.last_was_skipped = False

        self.ip_list.add(ip)
        logging.debug("Users: " + str(len(self.ip_list)) + ", Skips: " + str(len(self.skip_list)))
        j = {
            "id": self.currentVideo[0],
            "time": self.running_time(),
            "users": len(self.ip_list),
            "skips": self.skip_progress(),
            "last_skipped": self.last_was_skipped
        }
        return json.dumps(j)

    def reg_skip(self, ip):
        self.skip_list.add(ip)
        logging.debug("Skips " + str(len(self.skip_list)))
        logging.debug("Needed " + str(self.skip_thresh * len(self.ip_list)))

        if len(self.skip_list) >= self.skip_thresh * len(self.ip_list):
            self.next_video()
            self.last_was_skipped = True

    def skip_progress(self):
        skips = len(self.skip_list)
        needed = self.skip_thresh * len(self.ip_list)
        return int(100 * skips/needed)

    def next_video(self):
        if self.currentVideo:
            self.create_db_entry()
            logging.info("Video " + self.currentVideo[0] + " watched for " + str(self.running_time()) + "/" + str(self.currentVideo[1]) + "s")
            logging.debug("Watched by " + str(len(self.ip_list)) + ": " + str(self.ip_list))
            logging.debug("Skipped by " + str(len(self.skip_list)) + ": " + str(self.skip_list))
        self.skip_list = set()
        self.ip_list = set()
        self.currentVideo = self.queue.pop()
        logging.info("Now showing " + str(self.currentVideo))
        self.start_time = time.time()

    def running_time(self):
        return int(time.time() - self.start_time)

    def create_db_entry(self):
        v = Video(self.currentVideo[0])
        v.timestamp = datetime.datetime.fromtimestamp(self.start_time)
        v.length = self.currentVideo[1]
        v.watched = int(time.time() - self.start_time)
        v.viewers = len(self.ip_list)
        v.skips = len(self.skip_list)
        db.session.add(v)
        db.session.commit()

    def unregister(self, ip):
        self.skip_list.discard(ip)
        self.ip_list.discard(ip)

        if len(self.skip_list) >= self.skip_thresh * len(self.ip_list):
            self.next_video()

    class VideoQueue:

        def __init__(self):
            self.queue = []
            self.lower_thresh = 10
            self.upper_thresh = 20
            self.batch_size = 25

            self.word_list = []
            self.load_word_list()

            self.refill()

        def pop(self):
            ret = self.queue.pop(0)
            if len(self.queue) < self.lower_thresh:
                t = Thread(target=self.refill)
                t.setDaemon(True)
                t.start()
            return ret

        def refill(self):
            while len(self.queue) < self.upper_thresh:
                q = self.get_search_term()
                vid = youtube_search(q, self.batch_size)
                vid = (vid[0], vid[1], q)
                logging.debug("Added vid: " + str(vid))
                self.queue.append(vid)

        def load_word_list(self):
            f = open("app/api/words.txt", "r")
            for line in f:
                self.word_list.append(line.strip())
            f.close()

        def get_search_term(self):
            term = ""
            cnt = random.randint(1, 3)
            for i in range(cnt):
                term += self.word_list[random.randint(0, len(self.word_list)-1)] + " "
            return term.strip()
