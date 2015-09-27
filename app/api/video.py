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
        self.word_list = []

        self.currentVideo = None
        self.queue = []
        self.queue_thresh = 10
        self.queue_batch = 3

        self.ip_list = set()
        self.skip_list = set()
        self.skip_thresh = 0.5
        self.start_time = time.time()
        self.last_was_skipped = False

        self.load_word_list()
        self.populate_queue()

    def load_word_list(self):
        f = open("app/api/words.txt", "r")
        for line in f:
            self.word_list.append(line.strip())
        f.close()

    def populate_queue(self):
        term = self.get_search_term()
        logging.info("Search term: " + term)
        results = youtube_search(term, self.queue_batch)
        for r in results:
            self.queue.append(r)

        logging.info("Updated queue (" + str(len(self.queue)) + "): " + str([u[0] for u in self.queue]))

        random.shuffle(self.queue)

        if not self.currentVideo:
            self.currentVideo = self.queue.pop(0)

        if len(self.queue) < self.queue_thresh:
            self.populate_queue()

    def get_search_term(self):
        term = ""
        cnt = random.randint(1, 3)
        for i in range(cnt):
            term += self.word_list[random.randint(0, len(self.word_list)-1)] + " "
        return term.strip()

    def get_video(self, ip):
        if self.running_time() >= self.currentVideo[1]:
            t = Thread(target=self.next_video)
            t.setDaemon(True)
            t.start()
            self.last_was_skipped = False

        self.ip_list.add(ip)
        j = {
            "id": self.currentVideo[0],
            "time": self.running_time(),
            "users": len(self.ip_list),
            "skips": self.skip_progress(),
            "last_skipped": self.last_was_skipped
        }
        return json.dumps(j)

    def reg_skip(self, id):
        self.skip_list.add(id)
        if len(self.skip_list) >= self.skip_thresh * len(self.ip_list):
            t = Thread(target=self.next_video)
            t.setDaemon(True)
            t.start()
            self.last_was_skipped = True

    def skip_progress(self):
        skips = len(self.skip_list)
        needed = self.skip_thresh * len(self.ip_list)
        return int(100 * skips/needed)

    def next_video(self):
        self.create_db_entry()
        logging.info("Video " + self.queue[0][0] + " watched for " + str(self.running_time()) + "/" + str(self.queue[0][1]) + "s")
        logging.debug("Watched by " + str(len(self.ip_list)) + ": " + str(self.ip_list))
        logging.debug("Skipped by " + str(len(self.skip_list)) + ": " + str(self.skip_list))
        self.skip_list = set()
        self.ip_list = set()
        self.currentVideo = self.queue.pop(0)
        logging.info("Now showing " + self.currentVideo[0])
        self.start_time = time.time()
        if len(self.queue) < self.queue_thresh:
            self.populate_queue()

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
        self.skip_list.remove(ip)
        self.ip_list.remove(ip)
