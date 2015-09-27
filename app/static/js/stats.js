console.log('stats.js');

$(document).ready(function() { 

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

    // On Click Listeners
    $('.r').on("click", function() {
    	console.log(this);
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
	    	console.log($(this).children('td').eq(1));
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
	    	console.log($(this).children('td').eq(1));
	    });
	})
}

function getRowHTML(json) {
	var ret = 
	'<tr class="r">' +
		'<td>' + json.rank + '</td>' +
		'<td>' + json.title + '</td>' +
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