import datetime
import json
from app import db
from sqlalchemy.sql import func

class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ytid = db.Column(db.String(20), unique=True)

    timestamp = db.Column(db.DateTime)
    length = db.Column(db.Integer)
    watched = db.Column(db.Integer)

    viewers = db.Column(db.Integer)
    skips = db.Column(db.Integer)

    title = db.Column(db.String(200))
    query = db.Column(db.String(100))

    def __init__(self, ytid):
        self.ytid = ytid

    def __str__(self):
        return "<Video %s>" % self.ytid

    def getDateTimeLastPlayed(self):
        dt = self.timestamp
        return '{0}/{1}/{2:02} {3}:{4} {5}'.format(dt.month, dt.day, dt.year % 100, dt.strftime('%I').strip('0'), dt.minute if len(str(dt.minute)) > 1 else '0{0}'.format(dt.minute), dt.strftime('%p'))

    @staticmethod
    def avgVideoLength():
        avgVidLength = Video.query.with_entities(func.avg(Video.length).label("avgLength")).all()
        return avgVidLength[0][0]

    @staticmethod
    def avgViewerCount():
        avgViewerCount = Video.query.with_entities(func.avg(Video.viewers).label("avgViewers")).all()
        return avgViewerCount[0][0]

    @staticmethod
    def getVideosJSON():
        json_text = []
        for vo in Video.query.all():
            json_text.append({"id": vo.ytid, "viewers": vo.viewers, "timestamp": vo.getDateTimeLastPlayed(), "length": vo.length, "watched": vo.watched, "skips": vo.skips, "percentageWatched": '{0:.1f}'.format((vo.watched/vo.length)*100)})
        return json_text