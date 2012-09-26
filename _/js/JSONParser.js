var CACHED_TWEETS_URL = 'http://localhost:8888/cityPulse/tweetlapse/tweets.json';
var NEW_CACHED_TWEETS_URL = 'http://localhost:8888/cityPulse/tweetlapse/newestTweets.json';
var STREAMING_TWEETS_URL = 'https://stream.twitter.com/1.1/statuses/filter.json?track=STLDW';
var LIVE_TWEETS_STLDW = 'http://search.twitter.com/search.json?q=STLDW&rpp=1000&include_entities=true&result_type=recent';
var LIVE_TWEETS_NEAR_CAM = 'http://search.twitter.com/search.json?geocode=38.640959,-90.234879,3mi&include_entities=true&result_type=recent';
var TRACK_TWEETS = 'http://search.twitter.com/search.json?q=stldw&rpp=1000&include_entities=true&result_type=recent';
var LIVE_TWEETS_STRANGE_LOOP = 'http://search.twitter.com/search.json?q=strangeloop&rpp=1000&include_entities=true&result_type=recent';
var LIVE_TWEETS_CITY_PULSE = 'http://search.twitter.com/search.json?q=CPSTLDEMO&rpp=1000&include_entities=true&result_type=recent';
//'https://stream.twitter.com/1.1/statuses/filter.json?locations=38.640959,-90.234879';

var MAP_WIDTH = 1200;
var MAP_HEIGHT = 834;
var LNG_LEFT = -90.2792;
var LNG_RIGHT = -90.1903;
var LAT_BOTTOM = 38.6180;

var tweetNum;

$(document).ready(function(){

/***********************************/



/***********************************/

	var data;
	var tweetNum = 0;

	convertPoint(38.640691, -90.234922, 'cam'); //Plot the CAM for accuracy purposes.
	tweetNum++;

	$.ajax({
		url: LIVE_TWEETS_NEAR_CAM,
		data: data,
		type:'POST',
		crossDomain: true,
		dataType: "jsonp",
		success: function(data) {
			handleTweets(data, '');
		}
	});

	$.ajax({
		url: LIVE_TWEETS_STRANGE_LOOP,
		data: data,
		type:'POST',
		crossDomain: true,
		dataType: "jsonp",
		success: function(data) {
			handleTweets(data, 'strangeloop');
		}
	});

	$.ajax({
		url: LIVE_TWEETS_STLDW,
		data: data,
		type:'POST',
		crossDomain: true,
		dataType: "jsonp",
		success: function(data) {
			handleTweets(data, 'stldw');
			handleTimeline(data);
		}
	});


	// $.getJSON('_/php/streamTweets.php', function(data) {
	// 	console.log(data);
	// });

 	// $.ajax({
 	// 	type:"GET",
 	// 	url: "_/php/streamTweets.php",
 	// 	// data: data,
 	// 	dataType: "json",
 	// 	error: function(jqXHR, textStatus, errorThrown) {
 	// 		console.log(errorThrown);
 	// 	},
 	// 	success: function(data, textStatus, xhr) {
 	// 		if (!data) {
 	// 			console.log('Keep alive.');
 	// 		} else {
	 // 			console.log(data);
 	// 		}
 	// 	}
 	// });

 	function herp(data) {
 		console.log(data);
 	}

	/*
	 * While
	 * @results is the JSON object has next_page, cycle through next page
	 */
	function handleTweets(results, type) {
		handleTweetsHelper(results, 100, 0, type);
	}


	/*
	 * Get next_page from returned object to get page
	 * Get refresh_url in case data isn't workedout
	 */
	function handleTweetsHelper(results, pages, i, type) {
		printTweets(results, type);

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
					handleTweetsHelper(data, pages, i, type);
				}
			});
		} else {
			return;
		}
	}

	function handleTimeline(results) {
		handleTimelineHelper(results, 100, 0);
	}

	function handleTimelineHelper(results, pages, i) {
		printTimeline(results);

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

	function printTimeline(results) {
		var tweets = results.results;
		var tweetCount = (tweets) ? tweets.length : 0;
		for (var i = 0; i < tweetCount; i++) {
			var tweet = tweets[i];
			var timelineTweet = '<div class="timelineTweet" id="timelineTweet_' + tweetNum + '">';
 			timelineTweet += '<img class="tweetProfPic" src="' + tweet.profile_image_url_https + '" alt="profile_picture"/>';
 			timelineTweet += '<div class="tweetUserInfo"><span class="tweetName">' + tweet.from_user_name + '</span>';
 			timelineTweet += '<span class="tweetUserName">@' + tweet.from_user + '</span></div><hr/>';
 			timelineTweet += '<div class="tweetText">' + tweet.text + '</div>';
 			timelineTweet += '<div class="tweetTime">' + tweet.created_at + '</div>';
 			timelineTweet += '</div>';
			$(timelineTweet).appendTo('#timeline');
			tweetNum++;
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
	function printTweets(results, type) {
		var tweets = results.results;
		var tweetCount =  (tweets) ? tweets.length : 0;
		for (var i = 0; i < tweetCount; i++) {
			var tweet = tweets[i];

			if (tweet.geo) {
				lat = tweet.geo.coordinates[0];
				lng = tweet.geo.coordinates[1];
				if (Math.abs(lat) > 0 && Math.abs(lng) > 0) {
					plotTweet(tweet, lat, lng, type);
				}
			}

			if (tweet) {
				//Store tweets with and without geo locations for timeline
				// console.log(tweet);
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
	 			// console.log(errorThrown)

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
	 function plotTweet(tweet, lat, lng, type) {
	 	var coordinates = convertPoint(lat,lng, type); //store coordinates for drawing div later.
	 	//div id to tie point to tweet id
 		//console.log(tweetNum + ': ' + coordinates[0] + ', ' + coordinates[1] + '\n\t' + tweet.text + '\n\t' + tweet.created_at);
 		//get div id on hover, then display tweet on hover
		// var color = 'background-color:rgba(119,219,225, .85);';

		// if (type == 'strangeloop') {
		// 	color = 'background-color:rgba(19,219,225, 1);';
		// } else if (type == 'stldw') {
		// 	color = 'background-color:rgba(225,219,225, .85);';
		// } else if (type == 'cam') {

		// }

 		var tweetBox = '<div class="tweetBox '+ type +'" id="tweetBox_' + tweetNum + '" style="position:absolute; width:300px; top:'+ coordinates[1] + 25 +'px; left:'+ coordinates[0] + 25 +'px; display:none;" >';
 		tweetBox += '<img class="tweetProfPic" src="' + tweet.profile_image_url_https + '" alt="profile_picture"/>';
 		tweetBox += '<div class="tweetUserInfo"><span class="tweetName">' + tweet.from_user_name + '</span>';
 		tweetBox += '<span class="tweetUserName">@' + tweet.from_user + '</span></div><hr/>';
 		tweetBox += '<div class="tweetText">' + tweet.text + '</div>';
 		tweetBox += '<hr/>';
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
	 function convertPoint(lat, lng, type) {
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
	 		drawPoint(x,y, type);
	 		return [x, y];
		}

		return [0,0];
	 }

	 /*
	  * Draw point
	  */
	 function drawPoint(x, y, type){
	  	var dot_size = 10;
	  	var half_dot = Math.floor(dot_size/2);
	  	y = y - half_dot;
	  	x = x - half_dot;

		// var color = 'background-color:rgba(119,219,225, .85);';

		// if (type == 'strangeloop') {
		// 	color = 'background-color:rgba(19,219,225, 1);';
		// } else if (type == 'stldw') {
		// 	color = 'background-color:rgba(225,219,225, .85);';
		// }


	  	var dot = '<div class="tweetPoint '+ type +'" id="tweetPoint_' + tweetNum + '" style="position:absolute; width:' + dot_size + 'px; height:' + dot_size + 'px; top:' + y + 'px; left:' + x + 'px; color:white; border-radius:5px;"></div>';
	 	
	 	$(dot).appendTo('body');

	 	$('#tweetPoint_' + tweetNum).hover(
		 	function(){
		 		showTweet($(this).attr('id'));
		 	}, function(){
		 		// hideTweet($(this).attr('id'));
		 	}
	 	);
	 }

	 /*
	  * Show tweet
	  * @pointId is formatted as tweetPoint_##
	  */
	 function showTweet(pointId) {
	 	var pointNum = pointId.split('_')[1];
	 	// hideTweet(pointId);
	 	var visibleId = $('.visible').attr('id');
	  	var pointLast = (visibleId) ? visibleId.split('_')[1] : '';

	  	if (pointNum !== pointLast && pointLast) {
		  	$('.visible').delay(250).stop().fadeOut(250, function() {
		  		$(this).removeClass('visible');
		  		$('.selected').removeClass('selected');

		  		$('#tweetPoint_' + pointNum).addClass('selected');
			 	$('#tweetBox_' + pointNum).addClass('visible').show();
		  	});
	  	} else {
		 	$('#tweetPoint_' + pointNum).addClass('selected');
		 	$('#tweetBox_' + pointNum).addClass('visible').show();
		 }
	 }

	 /*
	  * Hide tweet
	  * @pointId is formatted as tweetPoint_##
	  */
	  function hideTweet(pointId) {
	  	var pointNum = pointId.split('_')[1];
	  	var visibleId = $('.visible').attr('id');
	  	var pointLast = (visibleId) ? visibleId.split('_')[1] : '';

	  	// console.log(pointNum + 'vs. ' + pointLast);

	  	if (pointNum !== pointLast) {
		  	$('.visible').stop().delay(250).fadeOut(250, function() {
		  		$(this).stop().removeClass('visible');
		  		$('.selected').stop().removeClass('selected');
		  	});
	  	}

	  	
	  	// $('#tweetBox_' + pointNum).delay(250).stop().fadeOut();
	  }

	  $('body').click(function(){
	  	$('.visible').stop().delay(250).fadeOut(250, function() {
	  		$(this).stop().removeClass('visible');
	  		$('.selected').stop().removeClass('selected');
	  	});
	  });

	  $('#stldw').toggle(function(){
	  	$(this).animate({'opacity' : .85});
	  	$('.stldw').addClass('highlighted');
	  	$('#timeline').fadeIn();
	  }, function(){
	  	$(this).animate({'opacity' : .25});
	  	$('.stldw').removeClass('highlighted');
	  	$('#timeline').fadeOut();
	  });

	  $('#strangeloop').toggle(function(){
	  	$(this).animate({'opacity' : .85});
	  	$('.strangeloop').addClass('highlighted');
	  }, function(){
	  	$(this).animate({'opacity' : .25});
	  	$('.strangeloop').removeClass('highlighted');
	  });

	  $('#citypulsedemo').click(function(){
		  	$(this).animate({'opacity' : .85});
	  		$.ajax({
				url: LIVE_TWEETS_CITY_PULSE,
				data: data,
				type:'POST',
				crossDomain: true,
				dataType: "jsonp",
				success: function(data) {
					handleTweets(data, 'citypulsedemo');
					handleTimeline(data);
				}
			});
	  });
});