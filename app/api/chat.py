from time import gmtime, strftime
import json

class Chat:

    __object = None


    @staticmethod
    def getObject():
        if not Chat.__object:
            Chat.__object = Chat()
        return Chat.__object

    def __init__(self):
        self.msgArray = []
        self.maxSize = 100
        self.msgCount = 0


    def appendMsg(self, msg):
        self.msgCount += 1
        self.msgArray.insert(0, {'msg': msg, 'time': strftime(("%I:%M %p"), gmtime())})
        if len(self.msgArray) > self.maxSize:
            self.msgArray.pop()

    def getMsgFeed(self):
        j = {
            'MsgCount': self.msgCount,
            'MsgArray': self.msgArray
        }
        return json.dumps(j)