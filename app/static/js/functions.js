$(document).ready(function() {

	// 2. This code loads the IFrame Player API code asynchronously.
	var tag = document.createElement('script');

	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	// Load On Click listers
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
});

/* Youtube API Functions */

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
			height: '390',
			width: '640',
			videoId: 'M7lc1UVf-VE',
			events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
done = false;
function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING && !done) {
		setTimeout(stopVideo, 6000);
		done = true;
	}
}

function stopVideo() {
	player.stopVideo();
}