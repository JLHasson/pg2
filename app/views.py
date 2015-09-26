from app import app
from .api.video import VideoTracker
from flask import render_template
from flask import request

import logging

logging.basicConfig(filename="server.log", level=logging.DEBUG)

tracker = VideoTracker.getObject()


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/api/skip')
def skip():
    ip = request.remote_addr
    tracker.reg_skip(ip)
    return str(len(tracker.skip_list)) + "\n" + str(tracker.queue)


@app.route('/api/get')
def get():
    ip = request.remote_addr
    return tracker.get_video(ip)


@app.route('/api/leave')
def leave():
    ip = request.remote_addr
    return tracker.unregister(ip)
