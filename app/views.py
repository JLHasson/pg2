from app import app
from .api import video


@app.route('/')
@app.route('/index')
def index():
    return "Hello, World!"


@app.route('/api/skip')
def skip():
    video.skipVideo()
    return "Recorded"


@app.route('/api/get')
def get():
    return video.getVideo()