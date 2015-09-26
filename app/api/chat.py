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
        self.msgArray.append(msg)
        if len(self.msgArray) > self.maxSize:
            self.msgArray.pop()
            self.msgCount = self.maxSize

    def getMsgFeed(self):
        j = {
            'MsgCount': self.msgCount,
            'MsgArray': self.msgArray
        }
        return json.dumps(j)