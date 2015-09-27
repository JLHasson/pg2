from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_pyfile("settings.cfg")
db = SQLAlchemy(app)

from app import views