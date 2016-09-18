<?php

//setup
$numberRestaurants = 27;
$numberCities = round($numberRestaurants/4);
$numberReviews = 500;
$numberReviewers = round($numberReviews/10);

//source data
$sourcePlaceNames = file(__DIR__.'/sources/placenames.txt');
$sourceStreets = file(__DIR__.'/sources/streets.txt');
$sourceNames = file(__DIR__.'/sources/names.txt');
$sourceSurnames = file(__DIR__.'/sources/surnames.txt');
$sourceText = file_get_contents(__DIR__.'/sources/loremipsum.txt');
$sourceParagraphs = file(__DIR__.'/sources/paragraphs.txt');
//

$allReviewers = getReviewers();
$allRestaurants = genRestaurants();
$allReviews = genReviews();
//


@mkdir(__DIR__.'/../server/data', 0777);
writeJSON(__DIR__.'/../server/data/customers.json', $allReviewers);
writeJSON(__DIR__.'/../server/data/restaurants.json', $allRestaurants);
writeJSON(__DIR__.'/../server/data/reviews.json', $allReviews);



//functions
function genRestaurants(){
	global $usedCities, $numberRestaurants;
	$ret = [];

	for($x = 0; $x < $numberRestaurants; $x++){
		$image = "images/restaurants/".(rand(1,20)).".jpg";
		$ret[] = [
			"id" => $x+1,
			"name" => _genPlaceName(),
			"address" => _genAddress(),
			"image" => $image,
			"operation" => _genOpHours()
		];
	}
	return $ret;
}

function getReviewers(){
	global $numberReviewers;
	$ret = [];

	for($x = 0; $x < $numberReviewers; $x++){
		$ava = "images/avatars/".(rand(1,9)).".jpg";
		$monthsPayed = rand(0, 30);
		$month = 86400*30;

		$start = time() - $monthsPayed * $month;

		$name = _genName();
		$email = _genEmail($name);

		$ret[] = [
			"id" => $x+1,
			"name" => $name,
			"email" => $email,
			"joined" => $start,
			"avatar" => $ava
		];
	}
	return $ret;
}

///


function genReviews(){
	global $numberReviews;

	$ret = [];
	for($x = 0; $x < $numberReviews; $x++){
		$ret[] = newReview();
	}
	return $ret;
}


function newReview(){
	global $allRestaurants, $allReviewers;
	$startDiff = rand(0, 100000000);
	$stars = rand(1,5);

	$restaurant = $allRestaurants[array_rand($allRestaurants)];
	$reviewer = $allReviewers[array_rand($allReviewers)];
	return [
		'id' => rand(0, 1000000),
		'timestamp' => time() - $startDiff,
		'reviewerId' => $reviewer['id'],
		'restaurantId' => $restaurant['id'],
		'title' => _getRandTitle(),
		'text' => _getRandText(),
		'stars' => $stars
	];
}

// file IO
function writeCSV($csvFile, $data, $keysFromFirstLine = true){
	$fp = fopen($csvFile, 'w');
	if($keysFromFirstLine && count($data)){
		$allKeys = array_keys($data[0]);
		fputcsv($fp, $allKeys,';');
	}
	foreach ($data as $fields) {
	    fputcsv($fp, $fields,';');
	}
	fclose($fp);
}

function readCSV($csvFile){
    $file_handle = fopen($csvFile, 'r');
    while (!feof($file_handle) ) {
        $line_of_text[] = fgetcsv($file_handle, 1024);
    }
    fclose($file_handle);
    return $line_of_text;
}

function writeJSON($jsonFile, $data){
	file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

///

function _genPlaceName(){
	global $sourcePlaceNames;

	$rid = array_rand($sourcePlaceNames);
	$rval = trim($sourcePlaceNames[$rid]);
	unset($sourcePlaceNames[$rid]); //keep place names unique

	return $rval;
}

function _genAddress(){
	global $sourceStreets;

	$rval = rand(1,200).' '.trim($sourceStreets[array_rand($sourceStreets)]);

	return $rval;
}


function _genOpHours()
{
	$openTimes = ['07:00','07:30','08:00','08:30','09:00','09:30','10:00','11:30','13:00', '17:30'];
	$closeTimes =   ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00'];

	$open = $openTimes[array_rand($openTimes)];
	$close = $closeTimes[array_rand($closeTimes)];

	return [
		'opens' => $open,
		'closes' => $close
	];

}
function _genName(){
	global $sourceNames, $sourceSurnames;

	$name = trim($sourceNames[rand(0, count($sourceNames)-1)]);
	$surname = trim($sourceSurnames[rand(0, count($sourceSurnames)-1)]);

	return "$name $surname";
}

function _genEmail($personName){
	$domain = 'example.com';
	return preg_replace('/[\s]+/','-',strtolower($personName)).'@'.$domain;
}

function _getRandP(){
	global $sourceParagraphs;
    $p = rand(0, count($sourceParagraphs)-1);
    return trim($sourceParagraphs[$p]);
}

function _getRandTitle($add = 0){
    $p = explode(' ', _getRandP());
    $l = rand(4+$add, 6+$add);
    return implode(' ', array_slice($p, 0, $l));
}

function _getRandText(){
	global $sourceParagraphs;
    $r = [];
    $pis = array_keys($sourceParagraphs);
    $rc = rand(4, 8);
    for($i =0; $i < $rc; $i++) {
        $t = rand(0, count($pis)-1);
        $r[] = $sourceParagraphs[$pis[$t]];
        unset($pis[$t]);
        $pis = array_values($pis);
    }

    return '<p>'.implode('</p><p>',$r).'</p>';
}
