$(document).ready(function() {

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

    $('.chat-panel').height($('#player').height());

	// Ask Web Server, Do I need to update? (every 500ms)
	setInterval(getCurrentVideo, 500);
});

function getCurrentVideo() {
	var getVideoURL = '/api/get';
	$.ajax({
			type: "GET",
			url: getVideoURL,
			success: parseResponse
	});
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

    console.log(start_time);

	updateYoutubeFrame(video_id, start_time);
	updateViewersLabel(viewer_count);
}

function updateYoutubeFrame(video_id, start_time) {

	console.log("updateYoutubeFrame to: " + video_id);

	// If youtubeFrameVideo is different than current video on Server
	if (youtubeFrameVideoId != video_id || (Math.abs(start_time - player.getCurrentTime()) > 2 && player.getPlayerState() != 2) ) {

		console.log("Change Video to: " + video_id);

		player.loadVideoById({
            'videoId': video_id,
            'startSeconds': start_time
        });

		// Update Global Variable
		youtubeFrameVideoId = video_id;
	}
}

function updateSkips(skips) {
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

function updateProgress(newValue) {
    $('.custom-progress').attr('aria-valuenow', newValue);
    $('.custom-progress').css('width', newValue.toString() + '%');
}
