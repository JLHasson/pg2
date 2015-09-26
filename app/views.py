from app import app
from .api import video

from flask import render_template


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/api/skip')
def skip():
    video.skipVideo()
    return "Recorded"


@app.route('/api/get')
def get():
    return video.getVideo()