#!/usr/bin/python

from apiclient.discovery import build
import isodate
import logging
logging.getLogger("googleapiclient.discovery").setLevel(logging.WARNING)


# Set DEVELOPER_KEY to the API key value from the APIs & auth > Registered apps
# tab of
#   https://cloud.google.com/console
# Please ensure that you have enabled the YouTube Data API for your project.
DEVELOPER_KEY = "AIzaSyBsn-BYrt_Rv41zb2AzRdwGjEOgpYUFs-E"
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"


def youtube_search(search_term, results):
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION,
                    developerKey=DEVELOPER_KEY)

    # Call the search.list method to retrieve results matching the specified
    # query term.
    search_response = youtube.search().list(
        q=search_term,
        part="id",
        maxResults=results
    ).execute()

    videos = []

    # Add each result to the appropriate list, and then display the lists of
    # matching videos
    for search_result in search_response.get("items", []):
        if search_result["id"]["kind"] == "youtube#video":
              videos.append((search_result["id"]["videoId"], video_length(search_result["id"]["videoId"])))

    return videos


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
