import tweepy
import configparser
import requests
import json
import urllib
import time 

from app import app # Checks db
from app.models import Video

config = configparser.ConfigParser()
config.read('settings_twitter.cfg')

DEVELOPER_KEY = config.get('TwitterSection', 'YOUTUBE_API_KEY')
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"

def getCurrentVideoId():
    getLastVideoAPI = 'http://pg2.tv/api/get'
    web_string = requests.get(getLastVideoAPI)
    r = requests.get(getLastVideoAPI)
    web_string = str(r.content)[2:-1] # Remove b'' - byte decorator
    json_dict = json.loads(web_string)
    
    ytId = json_dict['id']
    return ytId

def getTitleFromDatabase(ytId):
    title = Video.getVideoTitleById(ytId)
    return title

def main():
    cfg = { 
    "consumer_key"        : config.get('TwitterSection', 'CONSUMER_KEY_API_KEY'),
    "consumer_secret"     : config.get('TwitterSection', 'CONSUMER_SECRET_API_KEY'),
    "access_token"        : config.get('TwitterSection', 'ACCESS_TOKEN'),
    "access_token_secret" : config.get('TwitterSection', 'ACCESS_TOKEN_SECRET')
    }

    auth = tweepy.OAuthHandler(cfg['consumer_key'], cfg['consumer_secret'])
    auth.set_access_token(cfg['access_token'], cfg['access_token_secret'])
    api = tweepy.API(auth)

    count = 1
    while True:
        title = None
        ytId = getCurrentVideoId()
        print (ytId)

        countToTimeout = 0 # Look for another query incase title was not stored correctly
        # Wait for title to get stored in database
        while getTitleFromDatabase(ytId) == None and countToTimeout < 100: # Timeout after 10 minutes
            time.sleep(6) # Check every 6 seconds
            countToTimeout += 1
            print (countToTimeout)
        
        title = getTitleFromDatabase(ytId)
        if title != None:
            count += 1
            print (title)

            # Random Tweet Message
            if count % 2 == 1:
                tweet = "pg2.tv just played " + title + " #wutsNext #uTellMe"
            else:
                tweet = "pg2.tv just played " + title + " #watchpg2Tv"

            status = api.update_status(status=tweet)

if __name__ == "__main__":
    main()