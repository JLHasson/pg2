from app import app
from .api.video import VideoTracker
from .api.chat import Chat
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

@app.route('/api/chat', methods=["GET", "POST"])
def postMsg():
    print (request.headers)
    msg = request.headers.get('msg')
    if (msg != None):
        chat.appendMsg(msg)
    return chat.getMsgFeed()