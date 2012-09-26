var CACHED_TWEETS_URL = 'http://localhost:8888/cityPulse/tweetlapse/tweets.json';
var NEW_CACHED_TWEETS_URL = 'http://localhost:8888/cityPulse/tweetlapse/newestTweets.json';
var STREAMING_TWEETS_URL = 'https://stream.twitter.com/1.1/statuses/filter.json?track=STLDW';
var LIVE_TWEETS_URL = 'http://search.twitter.com/search.json?q=STLDW&rpp=1000&include_entities=true&result_type=mixed';
var LIVE_TWEETS_NEAR_CAM = 'http://search.twitter.com/search.json?geocode=38.640959,-90.234879,3mi&include_entities=true&result_type=recent';
var TRACK_TWEETS = 'http://search.twitter.com/search.json?q=stldw&rpp=1000&include_entities=true&result_type=recent';
var LIVE_TWEETS_STRANGE_LOOP = 'http://search.twitter.com/search.json?q=strangeloop&rpp=1000&include_entities=true&result_type=recent';

//'https://stream.twitter.com/1.1/statuses/filter.json?locations=38.640959,-90.234879';

var MAP_WIDTH = 1200;
var MAP_HEIGHT = 834;
var LNG_LEFT = -90.2792;
var LNG_RIGHT = -90.1903;
var LAT_BOTTOM = 38.6180;

var tweetNum;

$(document).ready(function(){

	var data;
	var tweetNum = 0;

	convertPoint(38.640691, -90.234922); //Plot the CAM for accuracy purposes.
	tweetNum++;

	//Attempt to load json
	$.ajax({
		url: LIVE_TWEETS_NEAR_CAM,
		data: data,
		type:'POST',
		crossDomain: true,
		dataType: "jsonp",
		success: function(data) {
			handleTweets(data);
		}
	});

	// $.ajax({
	// 	url: STREAMING_TWEETS_URL,
	// 	data: 'track=STLDW',
	// 	type:'POST',
	// 	crossDomain: true,
	// 	dataType: "jsonp",
	// 	success: function(data) {
	// 		handleTweets(data);
	// 	}
	// });

	/*
	 * While
	 * @results is the JSON object has next_page, cycle through next page
	 */
	function handleTweets(results) {
		handleTweetsHelper(results, 100, 0);
	}


	/*
	 * Get next_page from returned object to get page
	 * Get refresh_url in case data isn't workedout
	 */
	function handleTweetsHelper(results, pages, i) {
		printTweets(results);

		if (i <= pages && (results.next_page)) {
			var next = results.next_page;
			var nextURL = 'http://search.twitter.com/search.json' + next;
			
			i++;

			$.ajax({
				url: nextURL,
				data: data,
				type:'GET',
				crossDomain: true,
				dataType: "jsonp",
				success: function(data) {
					handleTweetsHelper(data, pages, i);
				}
			});
		} else {
			return;
		}
	}

	/*
	 * Print results
	 *
	 * 1. Avatar
	 * 2. Full Name
	 * 3. @username
	 * 4. Timestamp
	 * 5. Text
	 * 6. Actions, use web intents
	 * 	6.a. Reply
	 *	6.b. Retweet
	 *	6.c. Favourite
	 *	6.d. Follow
	 * 7. Entities
	 *	7.a. Photos
	 *	7.b. URLs
	 *	7.c. Mentions
	 *	7.d. Hashtags
	 * 8. Permalink
	 * 9. Retweet indicator
	 *	9.a. Retweet link to user's profile
	 *
	 */
	function printTweets(results) {
		var tweets = results.results;
		var tweetCount =  (tweets) ? tweets.length : 0;
		for (var i = 0; i < tweetCount; i++) {
			var tweet = tweets[i];

			if (tweet.geo) {
				lat = tweet.geo.coordinates[0];
				lng = tweet.geo.coordinates[1];
				if (Math.abs(lat) > 0 && Math.abs(lng) > 0) {
					plotTweet(tweet, lat, lng);
				}
			}

			if (tweet) {
				//Store tweets with and without geo locations for timeline
				console.log(tweet);
				storeTweets(tweet);
			}
		}
	}

	/*
	 * Store printed results in database
	 */
	 function storeTweets(tweet) {
		//console.log(tweet);
	 	$.ajax({
	 		type:"POST",
	 		url: "_/php/storeTweets.php",
	 		data: tweet,
	 		dataType: "json",
	 		error: function(jqXHR, textStatus, errorThrown) {
	 			console.log(errorThrown)
	 		},
	 		success: function(data) {
	 		}
	 	});
	 }

	/*
	 * Convert media sources geolocation from lat,long to x,y
	 * plots onto spherical mercator projection
	 * @tweet - full tweet JSON document
	 * @lat - latitude
	 * @long - longitude
	 */
	 function plotTweet(tweet, lat, lng) {
	 	var coordinates = convertPoint(lat,lng); //store coordinates for drawing div later.
	 	//div id to tie point to tweet id
 		//console.log(tweetNum + ': ' + coordinates[0] + ', ' + coordinates[1] + '\n\t' + tweet.text + '\n\t' + tweet.created_at);
 		//get div id on hover, then display tweet on hover

 		var tweetBox = '<div class="tweetBox" id="tweetBox_' + tweetNum + '" style="position:absolute; width:300px; top:'+ coordinates[1] + 25 +'px; left:'+ coordinates[0] + 25 +'px; display:none;" >';
 		tweetBox += '<img class="tweetProfPic" src="' + tweet.profile_image_url_https + '" alt="profile_picture"/>';
 		tweetBox += '<div class="tweetUserInfo"><span class="tweetName">' + tweet.from_user_name + '</span>';
 		tweetBox += '<span class="tweetUserName">@' + tweet.from_user + '</span></div><hr/>';
 		tweetBox += '<div class="tweetText">' + tweet.text + '</div>';
 		tweetBox += '<div class="tweetTime">' + tweet.created_at + '</div>';
 		tweetBox += '</div>';
 		$(tweetBox).appendTo('body');

	 	tweetNum++;
	 }

	/*
	 * Convert media sources geolocation from lat,long to x,y
	 * plots onto spherical mercator projection
	 * @lat - latitude
	 * @long - longitude
	 */
	 function convertPoint(lat, lng) {
	 	var mapLngDelta = LNG_RIGHT - LNG_LEFT;
	 	var mapBottomDegree = LAT_BOTTOM * Math.PI / 180;

	 	//Longitude
	 	var x = (lng - LNG_LEFT) * (MAP_WIDTH/mapLngDelta);

	 	//Latitude
	 	lat = lat * Math.PI / 180; //Convert from degrees to radians
	 	var worldMapWidth = ((MAP_WIDTH / mapLngDelta) * 360) / (2 * Math.PI);
	 	var mapOffsetY = (worldMapWidth / 2 * Math.log( (1 + Math.sin(mapBottomDegree)) / (1 - Math.sin(mapBottomDegree)) ) );
	 	var y = MAP_HEIGHT - ((worldMapWidth / 2 * Math.log((1 + Math.sin(lat)) / (1 - Math.sin(lat)))) - mapOffsetY);

	 	if (x > MAP_WIDTH || x < 0 || y > MAP_WIDTH || y < 0) {
			return [0,0];
	 	} else {
	 		drawPoint(x,y);
	 		return [x, y];
		}

		return [0,0];
	 }

	 /*
	  * Draw point
	  */
	 function drawPoint(x, y){
	  	var dot_size = 10;
	  	var half_dot = Math.floor(dot_size/2);
	  	y = y - half_dot;
	  	x = x - half_dot;
	  	var dot = '<div class="tweetPoint" id="tweetPoint_' + tweetNum + '" style="position:absolute; width:' + dot_size + 'px; height:' + dot_size + 'px; top:' + y + 'px; left:' + x + 'px; background:rgb(119, 219, 225); color:white; border-radius:5px;"></div>';
	 	
	 	$(dot).appendTo('body');

	 	$('#tweetPoint_' + tweetNum).hover(
		 	function(){
		 		showTweet($(this).attr('id'));
		 	}, function(){
		 		hideTweet($(this).attr('id'));
		 	}
	 	);
	 }

	 /*
	  * Show tweet
	  * @pointId is formatted as tweetPoint_##
	  */
	 function showTweet(pointId) {
	 	var pointNum = pointId.split('_')[1];
	 	$('#tweetBox_' + pointNum).stop().show();
	 }

	 /*
	  * Hide tweet
	  * @pointId is formatted as tweetPoint_##
	  */
	  function hideTweet(pointId) {
	  	var pointNum = pointId.split('_')[1];
	  	$('#tweetBox_' + pointNum).delay(250).stop().fadeOut();
	  }
});