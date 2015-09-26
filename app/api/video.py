
class Constant:
    currentvideo = 0
    skips = 0
    skipthresh = 3

    videos = [
        "video1",
        "video2",
        "video3",
        "video4"
    ]


def getVideo():
    return Constant.videos[Constant.currentvideo]


def skipVideo():
    Constant.skips += 1
    if Constant.skips is Constant.skipthresh:
        Constant.skips = 0
        Constant.currentvideo += 1
        if Constant.currentvideo >= len(Constant.videos):
            Constant.currentvideo = 0