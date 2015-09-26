console.log("functions.js");

var phpServer = "getContent.php";

$(document).ready(function(){

    // Load Event Listeners
    $("#skip").on("click", function() {

    	// Tell server that it should think about skipping video.
    	$.ajax({
    			type: "POST",
    			url: phpServer,
    			data: {
    				"Skip": true
    			}
    	});
    });

    // Load Current video in Frame
    getCurrentVideo();
	
	// Ask Web Server, Do I need to update? (every 500ms)
	setInterval(getCurrentVideo, 5000);
});

function getCurrentVideo() {
	$.ajax({
			type: "GET",
			url: phpServer, 
			success: updateFrame
	});
}

function updateFrame(result) {
	
	// If new video, update frame
	if ($("#videoFrame").html() != result) {
		$("#videoFrame").html(result);
	}
}