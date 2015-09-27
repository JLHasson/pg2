# Page2
Community driven synchronous youtube feed. Users are able to vote to skip the current video and move onto the next one.
If enough users vote to skip, everyone's browser immediately starts playing the next video. Users are able to discuss
the current video in the chatbox.

# Installation
Begin by installing python, virtualenv, and postgresql:

```
sudo apt-get install python3 python3-dev python-virtualenv postgresql
```

Then clone the repository:
```
git clone git@github.com:JLHasson/pg2.git
cd pg2
```

Create a virtualenv and install the server requirements. We recommend calling it "virtenv" because that is
what is specified in the gitignore file
```
virtualenv -p python3 virtenv
source virtenv/bin/activate
pip install -r requirements.txt
```

Finally, create a file called 'settings.cfg' in app/ with the database config and youtube api key information
```
YOUTUBE_API_KEY = "KEYDATA"
SQLALCHEMY_DATABASE_URI = "postgresql://user:password@host/database"
```

You can now run the server with:
```
python run.py
```