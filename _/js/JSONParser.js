var CACHED_TWEETS_URL = 'http://localhost:8888/cityPulse/tweetlapse/tweets.json';
var LIVE_TWEETS_URL = 'http://search.twitter.com/search.json?q=STLDW&rpp=20&include_entities=true&result_type=mixed'

$(document).ready(function(){

	var data;
	//Attempt to load local json
	$.ajax({
		url: LIVE_TWEETS_URL,
		data: data,
		type:'GET',
		crossDomain: true,
		dataType: "jsonp",
		success: function(data) {
			printTweets(data);
		},
		jsonpCallback: "printTweets"
	});

	function printTweets(r) {
		console.log(r);
	}

	// $.getJSON(CACHED_TWEETS_URL, function(data) {
		
	// 	$.each (data, function(key, value) {
	// 		var userName = value.user.name;
	// 		var userImage = value.user.profile_image_url_https;
	// 		var userDescription = value.user.description;
			
	// 		var tweet = value.text;
	// 		var tweetId = value.id;

	// 		var geo = (value.geo) ? value.geo.coordinates : "--";
	// 		var place = (value.place) ? value.place.name + ", " + value.place.country : "--";
	// 		var placeId = (value.place) ? value.place.id : "";
	// 		var coordinates = (value.coordinates) ? value.coordinates.coordinates : "--";
	// 		var time = value.created_at;
			
	// 		var html = '<div class="tweet" id="'+ tweetId +'"><div class="userInfo"><h1>'+ userName +'</h1><img src="'+ userImage +'" alt="'+ userName +'\'s profile picture."/><p>'+ userDescription +'</p></div><div class="tweetInfo"><h2>'+ tweet +'</h2> Time: ' + time + ' <div> Place: '+ place +' | Geo: ' + geo + ' | Coordinates: ' + coordinates + ' </div></div></div>'

	// 		$('body').append(html);
	// 	})
	// });
});