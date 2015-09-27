$(document).ready(function() {

	// Initalize msgCount, the amount of chat messages received, to 0. (Global Variable)
	msgCount = 0;

	// Initialize current DateTime (Global Variable)
	startDate = new Date();
	startSeconds = startDate.getTime();

	/* Load Current Day and Time in Chat Box */

	$('#chat-feed').append(getInitialChatBoxMessage())

	/* Set Up Youtube IFrame Player */

	// 2. This code loads the IFrame Player API code asynchronously.
	var tag = document.createElement('script');

	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	/* Load On Click Listeners */

    $('#skip-button').on("click", function() {
        originalSkip();
    	skip();
	});

    $('#skip-button').hover(function() {
        $('.skip-btn-inner').html('Key <span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span> to skip');
        setTimeout(originalSkip, 1250);
    }, function() {
        $('.skip-btn-inner').html('Skip <span class="glyphicon glyphicon-chevron-right skip-arrow" aria-hidden="true"></span>');
    });

    $('.skip-arrow').on(
        "webkitAnimationEnd oanimationend msAnimationEnd animationend",
        function() {
            $(this).removeClass("spin-animation");
        }
    );

    $('.chat-title').on("click", function() {
        if ($('.chat-panel').hasClass("no-chat")) {
            $('.chat-panel').removeClass("no-chat");
        } else {
            $('.chat-panel').addClass("no-chat");
        }
    });

	$('#submitMsg').on("click", function() {

		console.log("Submit Msg");
		sendMsg();
	});

	/* On Key Listener */

	$('#msgInput').on("keyup", function(e) {
		if(e.which == 13) {
            console.log('enter');
            sendMsg();
        }
	});

	$(document).on("keyup", function(e) {
		console.log(e);
		if(e.which == 39) {
			console.log("right");
			skip();
		}
	})

    $('.portlet-body').height($('#player').height() - $('.chat-title').height() - $('#input-container').height() - $('hr').height());

	// Ask Web Server, Do I need to update? (every 500ms)
	setInterval(getCurrentVideo, 500);

	// Update Chat Box
	setInterval(getMessageFeed, 500);

	$(window).unload(function(){
		$.ajax({url: "/api/leave", async: false});
	});
});

function originalSkip() {
    $('.skip-btn-inner').html('Skip <span class="glyphicon glyphicon-chevron-right skip-arrow" aria-hidden="true"></span>');
}

function skip() {
    if ($(this).hasClass("btn-danger")) {
        $('.skip-arrow').addClass('spin-animation');
    } else {
        var skipURL = '/api/skip';
		console.log("skip");
		$(this).toggleClass("btn-danger");
        $('.skip-arrow').addClass('spin-animation');

	    // Get Request to increment skip count
	    $.ajax({url: skipURL});
    }
}

function getInitialChatBoxMessage() {
	var ret =
	'<div class="row">' +
	// <!-- FILL THIS WITH THE CLIENT'S CURRENT TIME -->
	'<div class="col-lg-12">' +
	'<p class="text-center text-muted small">' + startDate.toLocaleTimeString("en-us", {weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"}) + '</p>' +
	'</div></div>';
	return ret;
}

function getCurrentVideo() {
	var getVideoURL = '/api/get';
	$.ajax({
			type: "GET",
			url: getVideoURL,
			success: parseResponse
	});
}

function getMessageFeed() {
	var apiChat = '/api/chat'
	$.ajax({
			type: "GET",
			url: apiChat,
			success: function(json_text) {
				console.log("getMessageFeed json " + json_text);
				var msgFeedObject = JSON.parse(json_text);
				var msgFeed = msgFeedObject['MsgArray'];
				var serverMsgCount = msgFeedObject['MsgCount'];

				var msgList = []

				for (var i = serverMsgCount - msgCount - 1; i >= 0; i--) {

					var today = new Date()
					var fakeDate = today.getMonth() + "-" + today.getDate() + "-" + today.getFullYear() + " " + msgFeed[i]['time']
					if (startSeconds < (new Date(fakeDate)).getTime()) { // If the message time is after the start time display it
						$('#chat-feed').append(getMsgHTML(msgFeed[i]));

						// Scroll Msg Feed to latest message
						$('#chat-feed').animate({
							scrollTop: $('#chat-feed').get(0).scrollHeight
						}, 500);
					} else {
						// Print anyways until server time is fixed
						$('#chat-feed').append(getMsgHTML(msgFeed[i]));

						// Scroll Msg Feed to latest message
						$('#chat-feed').animate({
							scrollTop: $('#chat-feed').get(0).scrollHeight
						}, 500);
					}
				}

				// Update Global Variable
				msgCount = serverMsgCount;
			}
	});
}

function getMsgHTML(msg) {

	var ret =
    '<div class="row">' +
    '<div class="col-lg-12">' +
        '<div class="media" style="margin-top: 5px;">' +
            '<div class="media-body" style="padding-left: 3px; padding-right: 3px;">' +
                // <!-- USERNAME HERE -->
                '<h4 class="media-heading">' + // Username' +
                    // <!-- CURRENT TIMESTAMP, THIS CAN BE DONE CLIENT SIDE -->
                    '<span class="small pull-right">' + msg['time'] + '</span>' +
                '</h4>' +
                // <!-- PUT THE MESSAGE HERE -->
                '<p>' + msg['msg'] + '</p>' +
            '</div>' +
    '</div></div></div>';
	return ret;
}

function sendMsg() {
	var postMsgURL = '/api/chat'
	var msgInput = $('#msgInput').val().trim();

	if (msgInput != '') {
		msgInput = msgInput.replace(/</g, "&lt;").replace(/>/g, "&gt;");

		// Clear input
		$('#msgInput').val('');

		$.ajax({
				type: "GET",
				url: postMsgURL,
				headers: {
					'msg': msgInput
				},
				success: function(response) {
					console.log(response);
				}
		});
	}
}

function parseResponse(json_text) {
    var videoState = JSON.parse(json_text)
    updateView(videoState);
    updateSkips(videoState['skips']);
}

function updateView(videoState) {

	var video_id = videoState['id'];
    var start_time = videoState['time'];
	var viewer_count = videoState['users'];
    var last_skipped = videoState['last_skipped'];

    console.log(start_time);

    checkSkipped(video_id, last_skipped, start_time);
	// updateYoutubeFrame(video_id, start_time);
	updateViewersLabel(viewer_count);
}

function updateYoutubeFrame(video_id, start_time) {

	// console.log("updateYoutubeFrame to: " + video_id);

	// If youtubeFrameVideo is different than current video on Server
	if (youtubeFrameVideoId != video_id || (Math.abs(start_time - player.getCurrentTime()) > 2 && player.getPlayerState() != 2) ) {

		console.log("Change Video to: " + video_id);

		player.loadVideoById({
            'videoId': video_id,
            'startSeconds': start_time
        });

		// Update Global Variable
		youtubeFrameVideoId = video_id;
        animationInProgress = false;
        if ($('#skip-button').hasClass('btn-danger') == true)
            $('#skip-button').toggleClass('btn-danger');
	}
}

function updateSkips(skips) {
    if (!animationInProgress)
        updateProgress(skips);
}

function updateViewersLabel(viewer_count) {

	$('#viewersCount').html(viewer_count);
}

// Used intially
function createYoutubeFrame(json_text) {

	var videoState = JSON.parse(json_text)
	var video_id = videoState['id'];
    var time = videoState['time'];

	// Store in Global Variable
	youtubeFrameVideoId = video_id;

	player = new YT.Player('player', {
			height: '390',
			width: '640',
			videoId: video_id,
			events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
			}
	});
}

/* Youtube API Functions */

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
function onYouTubeIframeAPIReady() {
	// Load Current Video
	var getVideoURL = '/api/get';
	$.ajax({
			type: "GET",
			url: getVideoURL,
			success: createYoutubeFrame
		});
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	event.target.playVideo();

	// Check to see if you need to load a new VideoById
	getCurrentVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
function onPlayerStateChange(event) {

}

function onPlayerError(event) {
    if (event.data == 5 || event.data == 101 || event.data == 150) {
        $.ajax({url: '/api/skip'});
    }
}

function stopVideo() {
	player.stopVideo();
}

function updateProgress(newValue) {
    $('.custom-progress').attr('aria-valuenow', newValue);
    $('.custom-progress').css('width', newValue.toString() + '%');
}

function checkSkipped(video_id, last_skipped, start_time) {

    if (youtubeFrameVideoId != video_id && last_skipped) {
        animationInProgress = true;
        updateProgress(100);
        $('#skip-button').fadeOut(500, function() {
            $('#skipped').fadeIn(500, function() {
                $('#skipped').fadeOut(500, function() {
                    $('#skip-button').fadeIn(500);
                });
            });
        });

        setTimeout(updateYoutubeFrame, 500, video_id, start_time);
    } else {
		updateYoutubeFrame(video_id, start_time);
	}
}
