<?php

$videos = ["video1",
			"video2",
			"video3",
			"video4",
			"video5"];

// Read Current Values
$currentIndexFile = fopen("currentIndexFile.txt", "r");
$currentIndex = intVal(fgets($currentIndexFile));
fclose($currentIndexFile);

$skipCountFile = fopen("currentSkipCount.txt", "r");
$skipCount = intVal(fgets($skipCountFile));
fclose($skipCountFile);

if (isset($_POST['Skip'])) {
	$skipCount++;
}

if ($skipCount > 3) {
	
	// Reset Index if last video
	if ($currentIndex == (count($videos) - 1)) {
		$currentIndex = -1;
	}
	$currentVideo = $videos[++$currentIndex];
	$skipCount = 0; // Reset Skip Count
} else {
	$currentVideo = $videos[$currentIndex];
}

// Write values to DB
$currentIndexFile = fopen("currentIndexFile.txt", "w");
fwrite($currentIndexFile, $currentIndex);
fclose($currentIndexFile);

$skipCountFile = fopen("currentSkipCount.txt", "w");
fwrite($skipCountFile, $skipCount);
fclose($skipCountFile);

echo $currentVideo;

?>