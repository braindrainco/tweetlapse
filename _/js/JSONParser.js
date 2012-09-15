var CACHED_TWEETS_URL = 'http://localhost:8888/cityPulse/tweetlapse/tweets.json';

$(document).ready(function(){
	console.log("Ready.");
	console.log("Attempting to get tweets.");
	$.getJSON(CACHED_TWEETS_URL, function(data) {
		
		$.each (data, function(key, value) {
			var userName = value.user.name;
			var userImage = value.user.profile_image_url_https;
			var userDescription = value.user.description;
			
			var tweet = value.text;
			var tweetId = value.id;

			var geo = value.geo;
			var place = value.place;
			var coordinates = value.coordinates;
			var time = value.created_at;
			
			var html = '<div class="tweet" id="'+ tweetId +'"><div class="userInfo"><h1>'+ userName +'</h1><img src="'+ userImage +'" alt="'+ userName +'\'s profile picture."/><p>'+ userDescription +'</p></div><div class="tweetInfo"><h2>'+ tweet +'</h2> Time: ' + time + ' <div> Place: '+ place +' | Geo: ' + geo + ' | Coordinates: ' + coordinates + ' </div></div></div>'

			$('body').append(html);
		})
	});
});