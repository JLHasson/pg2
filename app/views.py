from app import app
from .api.video import VideoTracker
from flask import render_template
from flask import request

tracker = VideoTracker.getObject()
chat = Chat.getObject()


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

@app.route('/api/chat')
def postMsg():
    msg = request.header.get('msg')
    chat.appendMsg(msg)