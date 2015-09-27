from app import db

class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ytid = db.Column(db.String(20), unique=True)

    timestamp = db.Column(db.DateTime)
    length = db.Column(db.Integer)
    watched = db.Column(db.Integer)

    viewers = db.Column(db.Integer)
    skips = db.Column(db.Integer)

    def __init__(self, ytid):
        self.ytid = ytid

    def __str__(self):
        return "<Video %s>" % self.ytid