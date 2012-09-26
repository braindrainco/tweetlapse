<?php	
	include('../inc/config.php');

	mysql_select_db('citypulse') or die ('Could not select database:' . mysql_error());

	/*
	 * Store results
	 *
	 * 1. Avatar (profile_image_url)
	 * 2. Full Name (from_user_name)
	 * 3. @username (from_user)
	 *	3.a. user id (from_user_id)
	 * 4. Timestamp (created_at)
	 * 5. Text (text)
	 * 6. Actions, use web intents
	 * 	6.a. Reply
	 *	6.b. Retweet
	 *	6.c. Favourite
	 *	6.d. Follow
	 * 7. Entities (entities)
	 *	7.a. Photos
	 *	7.b. URLs (urls)
	 *	7.c. Mentions (user_mentions)
	 *	7.d. Hashtags (hashtags)
	 * 8. Permalink (id)
	 * 9. Retweet indicator
	 *	9.a. Retweet link to user's profile
	 * 10. To User (to_user)
	 *	10.a. To User Id (to_user_id)
	 *	10.b. To User Nam (to_user_name)
	 * 11. Geo
	 * 12. Location
	 */

	$profile_image_url = htmlspecialchars(trim($_POST["profile_image_url"]));
	$from_user_name = htmlspecialchars(trim($_POST["from_user_name"]));
	$from_user = htmlspecialchars(trim($_POST["from_user"]));
	$from_user_id = htmlspecialchars(trim($_POST["from_user_id"]));
	
	//Reformating time
	$datetime = new DateTime($_POST["created_at"]);
	$created_at = $datetime->format('U');
	
	$text = htmlspecialchars(trim($_POST["text"]));

	$entities = $_POST["entities"]; //json_decode($_POST["entities"]);

	$file = "entities.txt";
	$fh = fopen($file, 'a');
	// $content = $from_user_name . ': ' . print_r($entities, true) . '\n';
	$content = 'Entities:' . print_r($entities["urls"], true) . 'is empty: ' . empty($entities["urls"]);
	fwrite($fh, $content);

	$urls = '-';
	$user_mentions = '-';
	$hashtags = '-';

	if (!empty($entities["urls"]) || !empty($entities->user_mentions) || !empty($entities->hashtags)) {
		//Formatting URLS ("url, url, url")
		// $urls = htmlspecialchars(trim(implode(",", $_POST["entities"]["urls"])));
		$tempUrls = array();
		foreach ($entities["urls"] as $url) {
			array_push($tempUrls, $url);
		}
		$urls = implode(",", $tempUrls);
		fwrite($fh, 'URLS:' . print_r($urls, true) . print_r($tempUrls, true));

		//Formatting Mentions ("@a, @b, @c")
		//$user_mentions = htmlspecialchars(trim(implode(",", $_POST["entities"]["user_mentions"])));
		$tempUsers = array();
				foreach ($entities->user_mentions as $user) {
			array_push($tempUsers, $user);
		}
		$user_mentions = implode(",", $tempUsers);

		//Formatting Hashtags ("#this, #is, #the, #money")
		//$hashtags = htmlspecialchars(trim(implode(",", $_POST["entities"]["hashtags"])));
		$tempHashtags = array();
		foreach ($entities->hashtags as $hashtag) {
			array_push($tempHashtags, $hashtag);
		}
		$hashtags = implode(",", $tempHashtags);
		fwrite($fh, '#s: ' . $hashtags . '\n\n');
	}
	
	$id = htmlspecialchars(trim($_POST["id"]));
	$to_user = htmlspecialchars(trim($_POST["to_user"]));
	$to_user_id = htmlspecialchars(trim($_POST["to_user_id"]));
	$to_user_name = htmlspecialchars(trim($_POST["to_user_name"]));
	$coordinates = htmlspecialchars(trim(implode(",", $_POST["geo"]["coordinates"])));
	$location = htmlspecialchars(trim($_POST["location"]));

	$stmt = "INSERT INTO tweets (profile_image_url, from_user_name, from_user, from_user_id, created_at, text, urls, user_mentions, hashtags, id, to_user, to_user_id, to_user_name, coordinates, location) VALUES ('$profile_image_url', '$from_user_name', '$from_user', '$from_user_id', '$created_at', '$text', '$urls', '$user_mentions', '$hashtags', '$id', '$to_user', '$to_user_id', '$to_user_name', '$coordinates', '$location')";
	mysql_query($stmt) or die('Could not store tweet: ' . mysql_error());
	mysql_close();
?>