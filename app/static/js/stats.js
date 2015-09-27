console.log('stats.js');

$(document).ready(function() { 

	// Initialize toggle views
	toggleCompareViewers = true;

	toggleFunctions = { 'Viewers': true, 
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
});

function buildTable() {
	var apiVideos = '/api/videos.json';
	
	$.get(apiVideos, function(json_text) {

		var json = JSON.parse(json_text);
		console.log(json);
		
		// Append to Table
		for (var i = 0; i < json.length; i++) {
			$('#bestTable').append(
								'<tr class="r">' +
									'<td>' + 'Rank' + '</td>' +
									'<td>' + json[i].id + '</td>' +
									'<td>' + json[i].viewers + '</td>' +
									'<td>' + json[i].skips + '</td>' +
									'<td>' + json[i].percentageWatched + '</td>' +
									'<td>' + json[i].watched + '</td>' +
									'<td>' + json[i]["length"] + '</td>' +
									'<td>' + json[i].timestamp + '</td>' +
								'</tr>');
		}
		
	})
}

function rebuildTable(column) {
	
	var compareFunctions = {'Viewers': compareViewers, 
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
			$('#bestTable').append(
								'<tr class="r">' +
									'<td>' + 'Rank' + '</td>' +
									'<td>' + json[i].id + '</td>' +
									'<td>' + json[i].viewers + '</td>' +
									'<td>' + json[i].skips + '</td>' +
									'<td>' + json[i].percentageWatched + '</td>' +
									'<td>' + json[i].watched + '</td>' +
									'<td>' + json[i]["length"] + '</td>' +
									'<td>' + json[i].timestamp + '</td>' +
								'</tr>');
		}
		
	})
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