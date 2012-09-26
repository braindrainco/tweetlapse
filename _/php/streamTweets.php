<?php
	header('Content-type: application/json');

	function my_streaming_callback($data, $length, $metrics) {
		// $cache = 'tweets-cache.txt';
		// $date = 'tweets-date.txt';
		// $expiry = "0";
 
		// $currentTime = time(); // Current time
		 
		// // Get cache time
		// $datefile = fopen($date, 'r');
		// $cacheDate = fgets($datefile);
		// fclose($datefile);
		 
		// //check if cache has expired
		// if (floor(abs(($currentTime-$cacheDate) / 3600)) <= $expiry && $cacheDate) {
		 
		//     $cachefile = fopen($cache, 'r');
		//     $data = fgets($cachefile);
		//     fclose($cachefile);
		 
		// } else { //renew the cache
		 
		//     //toggle between API
		//     // if ($_GET['q']) 
		//     // {
		//     //     $data = file_get_contents($_GET['api'] . '?q=' . urlencode($_GET['q']));   
		     
		//     // } else if ($_GET['screen_name']) 
		//     // {
		//     //     $data = file_get_contents($_GET['api'] . '?screen_name=' . $_GET['screen_name'] . '&count=' . $_GET['count'] . '&include_rts=' . $_GET['include_rts'] . '&include_entities=' . $_GET['include_entities']);   
		//     // }
		     
		//     // update cache file
		//     $cachefile = fopen($cache, 'wb');  
		//     fwrite($cachefile,utf8_encode($data));  
		//     fclose($cachefile); 
		 
		//     // update date file
		//     $datefile = fopen($date, 'wb');  
		//     fwrite($datefile, utf8_encode(time()));  
		//     fclose($datefile);   
		// }
		 
		$stream = json_decode($data);
		$stringToOutput = print_r($stream, true);

		while (!$stringToOutput) {
			$tmhOAuth->streaming_request('POST', $method, $params, 'my_streaming_callback');
			sleep(1);
		}

	    set_time_limit(0); 
	    ignore_user_abort(true);    
	    // buffer all upcoming output - make sure we care about compression: 
	    if(!ob_start("ob_gzhandler")) 
	        ob_start(); 

	    echo $stringToOutput;    
	    // get the size of the output 
	    $size = ob_get_length();    
	    // send headers to tell the browser to close the connection    
	    header("Content-Length: $size"); 
	    header('Connection: close');    
	    // flush all output 
	    ob_end_flush(); 
	    ob_flush(); 
	    flush();    
	    // close current session 
	    if (session_id()) session_write_close(); 
	}

	require 'tmhOAuth.php';
	require 'tmhUtilities.php';

	//BD
	$tmhOAuth = new tmhOAuth(array(
	    'consumer_key'               => 'o9HGjreSvms0iZr8mURwaQ',
	    'consumer_secret'            => 'PuI1q04fL8zcGsuwPRlcXIucOsvKmmjCC45sd5UAk',
	    'user_token'                 => '149622456-BiWeXT1Kx3X2LNwXqdfUpFmZbVSuKv4nbgA8HnGV',
	    'user_secret'                => 'zPkDGiFMqWyNzIy3SKQFDY99RJsnbC3VgjE0ZfOfew',
	));

	//CAS
	$tmhOAuth = new tmhOAuth(array(
	    'consumer_key'               => 'arquuLNU4NPmwTpQSv1ktQ',
	    'consumer_secret'            => 'Lv44JfLdXIHlzYEW8JlElCnjSog5WFEl6vNA0qIhVk',
	    'user_token'                 => '89757983-eBOriT5HJgD7P0F68qHzihN3AGkozudcwHG0tfZ4W',
	    'user_secret'                => '1qcnzzrkzB48NvgolTRRNSQFghQuB4uOx9e9PtPmag',
	));

	$method = 'https://stream.twitter.com/1/statuses/filter.json';

	$params = array(
	  // matches tweets containing 'twitter' 'Twitter' '#Twitter'
	  'track'     => 'citypulsestldemo',  
	  // matches tweets containing 'twitter' or 'love' (no spaces!)
	  //'track'   => 'twitter,love'
	  // matches tweets containing 'twitter' and 'love'
	  //'track'   =>'twitter love'
	  // Warning on extra spaces - below matches 'twitter' but not 'love'!
	  //'track'   =>'twitter, love'
	  // Around Twitter HQ. First param is the SW corner of the bounding box
	  // 'locations' => '-122.41,37.77,-122.40,37.78',
	  // 'follow'    => '777925' // themattharris
	);

	$tmhOAuth->streaming_request('POST', $method, $params, 'my_streaming_callback');

	tmhUtilities::pr($tmhOAuth);
?>