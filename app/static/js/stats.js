console.log('stats.js');

$(document).ready(function() {

	/* Set Up Youtube IFrame Player */

	// 2. This code loads the IFrame Player API code asynchronously.
	var tag = document.createElement('script');

	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	// Default toggle values for sorting
	toggleFunctions = { 'Rank': true,
						'Viewers': true,
						'Skips': true,
						'PercentagePlayed': true,
						'TimePlayed': true,
						'Length': true,
						'LastPlayed': true};

    // Build Table sorted by Viewers
    buildTable();

    var column_ids = ['Rank', 'Video', 'Viewers', 'Skips', 'PercentagePlayed', 'TimePlayed', 'Length', 'LastPlayed'];

    for (var i = 0; i < column_ids.length; i++) {

    	$('#' + column_ids[i]).on('click', function() {
    		rebuildTable(this.id);
    	});
    }

	$('#myModal').on('hidden.bs.modal', function () {
		player.stopVideo();
	});
});

function buildTable() {
	var apiVideos = '/api/videos.json';

	$.get(apiVideos, function(json_text) {

		var json = JSON.parse(json_text);
		console.log(json);

		// Append to Table
		for (var i = 0; i < json.length; i++) {
			$('#bestTable').append(getRowHTML(json[i]));
		}
		// On Click Listeners
	    $('.r').on("click", function() {
	    	console.log(this.id);
			updateYoutubeFrame(this.id);
	    });
	})
}

function rebuildTable(column) {

	// Used for Sorting
	var compareFunctions = {'Rank': compareRanks,
							'Viewers': compareViewers,
							'Skips': compareSkips,
							'PercentagePlayed': comparePercentageWatched,
							'TimePlayed': compareWatched,
							'Length': compareLength,
							'LastPlayed': compareLastPlayed};

	var apiVideos = '/api/videos.json';

	$.get(apiVideos, function(json_text) {

		var json = JSON.parse(json_text);
		console.log(json);

		json.sort(compareFunctions[column]);

		toggleFunctions[column] = !toggleFunctions[column];
		console.log(toggleFunctions[column]);

		// Remove Old Rows
		$('.r').remove();

		// Append to Table
		for (var i = 0; i < json.length; i++) {
			$('#bestTable').append(getRowHTML(json[i]));
		}

		// On Click Listeners
	    $('.r').on("click", function() {
	    	console.log(this.id);
			updateYoutubeFrame(this.id);
			// player.loadVideoById(this.id.toString());
			// player.playVideo();
			// createYoutubeFrame(this.id);
	    });
	})
}

function getRowHTML(json) {
	var ret =
	'<tr class="r" data-toggle="modal" data-target="#myModal" id="' + json.id + '">' +
		'<td>' + json.rank + '</td>' +
		'<td id="'+ json.id +'">' + json.title + '</td>' +
		'<td>' + json.viewers + '</td>' +
		'<td>' + json.skips + '</td>' +
		'<td>' + json.percentageWatched + '</td>' +
		'<td>' + secondsToTimeFormat(json.watched) + '</td>' +
		'<td>' + secondsToTimeFormat(json["length"]) + '</td>' +
		'<td>' + json.timestamp + '</td>' +
	'</tr>';
	return ret;
}

function compareRanks(a,b) {
  if (toggleFunctions['Rank']) {
	  if (a.rank < b.rank)
	    return 1;
	  if (a.rank > b.rank)
	    return -1;
	  return 0;
	} else {
	  if (a.rank < b.rank)
	    return -1;
	  if (a.rank > b.rank)
	    return 1;
	  return 0;
	}
}

function compareViewers(a,b) {
  if (toggleFunctions['Viewers']) {
	  if (a.viewers < b.viewers)
	    return 1;
	  if (a.viewers > b.viewers)
	    return -1;
	  return 0;
	} else {
	  if (a.viewers < b.viewers)
	    return -1;
	  if (a.viewers > b.viewers)
	    return 1;
	  return 0;
	}
}

function compareSkips(a,b) {
  if (toggleFunctions['Skips']) {
	  if (a.skips < b.skips)
	    return 1;
	  if (a.skips > b.skips)
	    return -1;
	  return 0;
  } else {
 	  if (a.skips < b.skips)
	    return -1;
	  if (a.skips > b.skips)
	    return 1;
	  return 0;
  }
}

function comparePercentageWatched(a,b) {
  if (toggleFunctions['PercentagePlayed']) {
	  if (a.percentageWatched < b.percentageWatched)
	    return 1;
	  if (a.percentageWatched > b.percentageWatched)
	    return -1;
	  return 0;
  } else {
  if (a.percentageWatched < b.percentageWatched)
	    return -1;
	  if (a.percentageWatched > b.percentageWatched)
	    return 1;
	  return 0;
  }
}

function compareWatched(a,b) {
  if (toggleFunctions['TimePlayed']) {
	  if (a.watched < b.watched)
	    return 1;
	  if (a.watched > b.watched)
	    return -1;
	  return 0;
  } else {
  	  if (a.watched < b.watched)
	    return -1;
	  if (a.watched > b.watched)
	    return 1;
	  return 0;
  }
}

function compareLength(a,b) {
  if (toggleFunctions['Length']) {
	  if (a["length"] < b["length"])
	    return 1;
	  if (a["length"] > b["length"])
	    return -1;
	  return 0;
  } else {
  	  if (a["length"] < b["length"])
	    return -1;
	  if (a["length"] > b["length"])
	    return 1;
	  return 0;
  }
}

function compareLastPlayed(a,b) {
  if (toggleFunctions['LastPlayed']) {
	  if (a.timestamp < b.timestamp)
	    return 1;
	  if (a.timestamp > b.timestamp)
	    return -1;
	  return 0;
  } else {
	  if (a.timestamp < b.timestamp)
	    return -1;
	  if (a.timestamp > b.timestamp)
	    return 1;
	  return 0;
  }
}

function secondsToTimeFormat(seconds) {
	var myDate = new Date(null, null, null, null, null, seconds).toTimeString().match(/\d{2}:\d{2}:\d{2}/)[0]
	return myDate
}

/* Youtube API */

// Used intially
function createYoutubeFrame(video_id) {

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

function updateYoutubeFrame(video_id) {

	// console.log("updateYoutubeFrame to: " + video_id);

	console.log("Change Video to: " + video_id);

	player.loadVideoById({
        'videoId': video_id
    });
}

/* Youtube API Functions */

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
function onYouTubeIframeAPIReady() {
	// Load Current Video
	// var getVideoURL = '/api/get';
	// $.ajax({
	// 		type: "GET",
	// 		url: getVideoURL,
	// 		success: createYoutubeFrame
	// 	});
	var video_id = $('.r').first().id;
	console.log(video_id);
	var test_id = 'M7lc1UVf-VE';

	createYoutubeFrame(test_id);
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	// event.target.playVideo();
	stopVideo();

	// Check to see if you need to load a new VideoById
	// getCurrentVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
function onPlayerStateChange(event) {

}

function onPlayerError(event) {
    // if (event.data == 5 || event.data == 101 || event.data == 150) {
    //     $.ajax({url: '/api/skip'});
    // }
}

function stopVideo() {
	player.stopVideo();
}
