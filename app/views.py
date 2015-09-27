from app import app
from .api.video import VideoTracker
from .api.chat import Chat
from flask import render_template
from flask import request

import logging
from .models import Video

logging.basicConfig(filename="server.log", level=logging.DEBUG)

tracker = VideoTracker.getObject()
chat = Chat.getObject()

def get_ip():
    ip = request.remote_addr
    if len(ip) == 0 or ip == "b''":
        ip = request.headers["X-Real-IP"]
    return ip


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/stats')
def stats():
    vids = Video.query.order_by(Video.id).all()
    return render_template('stats.html', best=vids)

@app.route('/api/skip')
def skip():
    ip = get_ip()
    tracker.reg_skip(ip)
    return str(len(tracker.skip_list)) + "\n" + str(tracker.queue)

@app.route('/api/get')
def get():
    ip = get_ip()
    return tracker.get_video(ip)

@app.route('/api/chat', methods=["GET", "POST"])
def postMsg():
    msg = request.headers.get('msg')
    if (msg != None):
        chat.appendMsg(msg)
    return chat.getMsgFeed()

@app.route('/api/leave')
def leave():
    ip = get_ip()
    tracker.unregister(ip)
    return None
