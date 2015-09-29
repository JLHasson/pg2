import tweepy
import configparser
import random

class TweetBot():

    def __init__(self):
        # Set Attributes
        self.config = configparser.ConfigParser()
        self.config.read('settings_twitter.cfg')
        self.DEVELOPER_KEY = self.config.get('TwitterSection', 'YOUTUBE_API_KEY')
        self.YOUTUBE_API_SERVICE_NAME = "youtube"
        self.YOUTUBE_API_VERSION = "v3"

        # Call Authenticate Method
        self.authenticateTwitter()

    def authenticateTwitter(self):
        cfg = { 
        "consumer_key"        : self.config.get('TwitterSection', 'CONSUMER_KEY_API_KEY'),
        "consumer_secret"     : self.config.get('TwitterSection', 'CONSUMER_SECRET_API_KEY'),
        "access_token"        : self.config.get('TwitterSection', 'ACCESS_TOKEN'),
        "access_token_secret" : self.config.get('TwitterSection', 'ACCESS_TOKEN_SECRET')
        }

        self.auth = tweepy.OAuthHandler(cfg['consumer_key'], cfg['consumer_secret'])
        self.auth.set_access_token(cfg['access_token'], cfg['access_token_secret'])
        self.api = tweepy.API(self.auth)

    def tweet(self, ytId, title, viewers, skips, query):
        hashtag_array = ["#wutsNext #uTellMe", "#watchpg2Tv"]
        youtube_link = 'youtu.be/{0}'.format(ytId)
        print (youtube_link)
        print (title)
        print (query)

        random_index = random.randrange(0, len(hashtag_array))

        if title != None:
            tweet = "pg2.tv is playing: " + title

            if len(tweet) + len(youtube_link) + len(hashtag_array[random_index]) <= 140:
                tweet += ' ' + youtube_link + ' ' + hashtag_array[random_index]
            elif len(tweet) + len(hashtag_array[random_index]) <= 140:
                tweet += ' ' + hashtag_array[random_index]

            print (tweet)
            status = self.api.update_status(status=tweet)