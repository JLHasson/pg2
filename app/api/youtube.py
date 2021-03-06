#!/usr/bin/python

from apiclient.discovery import build
import isodate
import logging
import random
logging.getLogger("googleapiclient.discovery").setLevel(logging.WARNING)
logging.getLogger("googleapiclient.discovery_cache.file_cache").setLevel(logging.WARNING)
from app import app

# Set DEVELOPER_KEY to the API key value from the APIs & auth > Registered apps
# tab of
#   https://cloud.google.com/console
# Please ensure that you have enabled the YouTube Data API for your project.
DEVELOPER_KEY = app.config["YOUTUBE_API_KEY"]
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"


def youtube_search(search_term, results):
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION,
                    developerKey=DEVELOPER_KEY)

    # Call the search.list method to retrieve results matching the specified
    # query term.
    search_response = youtube.search().list(
        q=search_term,
        part="id,snippet",
        maxResults=results
    ).execute()


    # Add each result to the appropriate list, and then display the lists of
    # matching videos
    result = search_response.get("items", [])
    if len(result) < 2:
        return None
    logging.debug("Got " + str(len(result)) + " results for: " + search_term)
    vid = None
    while not vid or vid["id"]["kind"] != "youtube#video":
        vid = result[random.randint(0, len(result)-1)]

    id = vid["id"]["videoId"]
    title = vid["snippet"]["title"]

    return id, video_length(id), title


def video_length(id):
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION,
                    developerKey=DEVELOPER_KEY)

    resp = youtube.videos().list(
        part="id,contentDetails",
        id=id
    ).execute()

    return parse_time(resp.get("items", [])[0]["contentDetails"]["duration"])


def parse_time(time):
    return isodate.parse_duration(time).total_seconds()


def get_title(id):
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION,
                    developerKey=DEVELOPER_KEY)

    resp = youtube.videos().list(
        part="id,snippet",
        id=id
    ).execute()

    return resp.get("items", [])[0]["snippet"]["title"]