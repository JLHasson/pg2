import datetime
import json
from app import db,session
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
        dt = (self.timestamp - datetime.datetime(1970,1,1)).total_seconds() * 1000
        milliseconds, microseconds = divmod(dt, 1)
        return milliseconds

    def getRank(self):
        rank = self.getPercentageWatched() * ((self.viewers-self.skips)/(self.viewers+1))
        rank = float("{0:.1f}".format(rank))
        return rank

    def getPercentageWatched(self):
        return float('{0:.1f}'.format((self.watched/self.length)*100))

    @staticmethod
    def getVideoTitleById(id):
        q = session.query(Video)
        vids = q.order_by(Video.id).all()
        for vo in vids:
            if vo.ytid == id:
                return vo.title

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
        q = session.query(Video)
        vids = q.order_by(Video.id).all()
        for vo in vids:
            json_text.append({"rank": vo.getRank(), "title": vo.title, "query": vo.query, "id": vo.ytid, "viewers": vo.viewers, "timestamp": vo.getDateTimeLastPlayed(), "length": vo.length, "watched": vo.watched, "skips": vo.skips, "percentageWatched": vo.getPercentageWatched()})
        return json_text