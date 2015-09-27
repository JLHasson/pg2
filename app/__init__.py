from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

app = Flask(__name__)
app.config.from_pyfile("settings.cfg")
db = SQLAlchemy(app)
e = create_engine(app.config["SQLALCHEMY_DATABASE_URI"])
S = sessionmaker(bind=e)
session = S()


from app import views