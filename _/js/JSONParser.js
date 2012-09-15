$(document).ready(function(){
	$.getJSON('tweets.json', function(data){
		var items = [];

		$.each(data, function(key, val){
			items.push('<li>' + val + '</li>');
		});
		
	}).appendTo('body');
});