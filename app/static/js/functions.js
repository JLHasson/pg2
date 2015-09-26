$(document).ready(function() {

	// Initalize msgCount, the amount of chat messages received, to 0. (Global Variable)
	msgCount = 0;

	/* Set Up Youtube IFrame Player */

	// 2. This code loads the IFrame Player API code asynchronously.
	var tag = document.createElement('script');

	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	/* Load On Click Listeners */

	$('#skip-button').on("click", function() {
		var skipURL = '/api/skip';
		console.log("skip");
		$(this).toggleClass("btn-danger");
	    if ($('#keep-button').hasClass('btn-success'))
	        $('#keep-button').toggleClass("btn-success");

	    // Get Request to increment skip count
	    $.ajax({url: skipURL});
	});

	$('#keep-button').on("click", function() {
		console.log("keep");
	    $(this).toggleClass("btn-success");
	    if ($('#skip-button').hasClass('btn-danger'))
	        $('#skip-button').toggleClass("btn-danger");
	});

	$('#submitMsg').on("click", function() {
		var postMsgURL = '/api/chat'
		console.log("Submit Msg");

		var msgInput = $('#msgInput').val();

		console.log(msgInput);
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
	});

    $('.portlet-body').height($('#player').height() - $('.chat-title').height() - $('#input-container').height() - $('hr').height());

	// Ask Web Server, Do I need to update? (every 500ms)
	setInterval(getCurrentVideo, 500);

	// Update Chat Box
	//setInterval(getMessageFeed, 500);
});

function getCurrentVideo() {
	var getVideoURL = '/api/get';
	$.ajax({
			type: "GET",
			url: getVideoURL,
			success: updateView
	});
}

function getMessageFeed() {
	var apiChat = '/api/chat'
	$.ajax({
			type: "GET",
			url: apiChat,
			success: function(json_text) {
				console.log(json_text);
				var msgFeedObject = JSON.parse(json_text);
				var msgFeed = msgFeedObject['MsgArray'];
				var serverMsgCount = msgFeedObject['MsgCount'];

				for (var i = msgCount; i < serverMsgCount; i++) {
					$("#chat-feed").append('<li>' + msgFeed[i] + '</li>');
				}

				// Update Global Variable
				msgCount = serverMsgCount;
			}
	});
}

function updateView(json_text) {

	console.log(json_text);
	var videoState = JSON.parse(json_text)
	var video_id = videoState['id'];
	var viewer_count = videoState['users'];

	updateYoutubeFrame(video_id);
	updateViewersLabel(viewer_count);
}

function updateYoutubeFrame(video_id) {

	console.log("updateYoutubeFrame to: " + video_id);

	// If youtubeFrameVideo is different than current video on Server
	if (youtubeFrameVideoId != video_id) {

		console.log("Change Video to: " + video_id);

		player.loadVideoById({'videoId': video_id});

		// Update Global Variable
		youtubeFrameVideoId = video_id;
	}
}

function updateViewersLabel(viewer_count) {

	$('#viewersCount').html(viewer_count);
}

// Used intially
function createYoutubeFrame(json_text) {

	var videoState = JSON.parse(json_text)
	var video_id = videoState['id'];

	// Store in Global Variable
	youtubeFrameVideoId = video_id;

	player = new YT.Player('player', {
			height: '390',
			width: '640',
			videoId: video_id,
			events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
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

function stopVideo() {
	player.stopVideo();
}
