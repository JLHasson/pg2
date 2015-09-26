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


    def appendMsg(self, msg):
        self.msgArray.append(msg)
        if len(self.msgArray) > self.maxSize:
            self.msgArray.pop()

    def getMsgFeed(self):
        j = {
            'MsgArray': self.msgArray
        }
        return json.dumps(j)