from app import app
from .api.video import VideoTracker
from flask import render_template

tracker = VideoTracker.getObject()




@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/api/skip')
def skip():
    tracker.reg_skip()
    return str(tracker.skips) + "\n" + str(tracker.queue)


@app.route('/api/get')
def get():
    return tracker.get_video()