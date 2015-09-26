from threading import Thread
import random

from .youtube import youtube_search


class VideoTracker:

    __object = None

    @staticmethod
    def getObject():
        if not VideoTracker.__object:
            VideoTracker.__object = VideoTracker()
        return VideoTracker.__object

    def __init__(self):
        self.word_list = []
        self.queue = []
        self.queue_thresh = 10
        self.queue_batch = 20
        self.skip_thresh = 3
        self.skips = 0

        self.load_word_list()
        self.populate_queue()

    def load_word_list(self):
        f = open("app/api/words.txt", "r")
        for line in f:
            self.word_list.append(line.strip())
        f.close()

    def populate_queue(self):
        term = self.get_search_term()
        print(term)
        results = youtube_search(term, self.queue_batch)
        for r in results:
            self.queue.append(r)

        print("Ready:")
        print(str(self.queue))

    def get_search_term(self):
        term = ""
        cnt = random.randint(1, 3)
        for i in range(cnt):
            term += self.word_list[random.randint(0, len(self.word_list)-1)] + " "
        return term.strip()



    def get_video(self):
        return self.queue[0]

    def reg_skip(self):
        self.skips += 1
        if self.skips == self.skip_thresh:
            t = Thread(target=self.next_video)
            t.setDaemon(True)
            t.start()

    def next_video(self):
        self.skips = 0
        self.queue.pop(0)
        if len(self.queue) < self.queue_thresh:
            self.populate_queue()
