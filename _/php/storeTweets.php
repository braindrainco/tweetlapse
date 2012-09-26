<?php	
	require 'config.php';

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

	$urls = '-';
	$user_mentions = '-';
	$hashtags = '-';
	$media = '-';
	$stldw = 0;
	$strangeLoop = 0;

	if (!empty($entities["urls"]) || !empty($entities["user_mentions"]) || !empty($entities["hashtags"]) || !empty($entities["media"])) {
		//Formatting URLS ("url, url, url")
		// $urls = htmlspecialchars(trim(implode(",", $_POST["entities"]["urls"])));
		$tempUrls = array();
		foreach ($entities["urls"] as $urlArray) {
			array_push($tempUrls, $urlArray["display_url"] . ',' . $urlArray["expanded_url"] . ',' . $urlArray["url"]);
		}
		$urls = implode("|", $tempUrls);
		//fwrite($fh, 'URLS:' . $urls);

		//Formatting Mentions ("@a, @b, @c")
		//$user_mentions = htmlspecialchars(trim(implode(",", $_POST["entities"]["user_mentions"])));
		$tempUsers = array();
		foreach ($entities["user_mentions"]as $userArray) {
			array_push($tempUsers, $userArray["id"] . ',' . $userArray["name"] . ',' . $userArray["screen_name"]);
		}
		$user_mentions = implode("|", $tempUsers);
		//fwrite($fh, 'Users:' . $user_mentions);

		//Formatting Hashtags ("#this, #is, #the, #money")
		//$hashtags = htmlspecialchars(trim(implode(",", $_POST["entities"]["hashtags"])));
		$tempHashtags = array();
		foreach ($entities["hashtags"] as $hashtagArray) {
			array_push($tempHashtags, $hashtagArray["text"]);
			if (strtolower($hashtagArray["text"]) == "stldw") {
				$stldw = 1;
			}

			if (strtolower($hashtagArray["text"]) == "strangeloop") {
				$strangeloop = 1;
			}
		}
		$hashtags = implode("|", $tempHashtags);
		fwrite($fh, '#s: ' . print_r($hashtags, true));

		$tempMedia = array();
		foreach ($entities["media"] as $mediaArray) {
			array_push($tempMedia, $mediaArray["media_url"] . ',' . $mediaArray["display_url"]);
		}
		$media = implode("|", $tempMedia);
	}
	
	$id = htmlspecialchars(trim($_POST["id"]));
	$to_user = htmlspecialchars(trim($_POST["to_user"]));
	$to_user_id = htmlspecialchars(trim($_POST["to_user_id"]));
	$to_user_name = htmlspecialchars(trim($_POST["to_user_name"]));
	$coordinates = htmlspecialchars(trim(implode(",", $_POST["geo"]["coordinates"])));
	$location = htmlspecialchars(trim($_POST["location"]));

	$stmt = "INSERT INTO tweets (stldw, strangeloop, profile_image_url, from_user_name, from_user, from_user_id, created_at, text, urls, media, user_mentions, hashtags, id, to_user, to_user_id, to_user_name, coordinates, location) VALUES ('$stldw', '$strangeloop','$profile_image_url', '$from_user_name', '$from_user', '$from_user_id', '$created_at', '$text', '$urls', '$media', '$user_mentions', '$hashtags', '$id', '$to_user', '$to_user_id', '$to_user_name', '$coordinates', '$location')";
	mysql_query($stmt) or die('Could not store tweet: ' . mysql_error());
	mysql_close();
?>