var CACHED_TWEETS_URL="http://localhost:8888/cityPulse/tweetlapse/tweets.json",NEW_CACHED_TWEETS_URL="http://localhost:8888/cityPulse/tweetlapse/newestTweets.json",STREAMING_TWEETS_URL="https://stream.twitter.com/1.1/statuses/filter.json?track=STLDW",LIVE_TWEETS_STLDW="http://search.twitter.com/search.json?q=STLDW&rpp=1000&include_entities=true&result_type=mixed",LIVE_TWEETS_NEAR_CAM="http://search.twitter.com/search.json?geocode=38.640959,-90.234879,3mi&include_entities=true&result_type=recent",TRACK_TWEETS="http://search.twitter.com/search.json?q=stldw&rpp=1000&include_entities=true&result_type=recent",LIVE_TWEETS_STRANGE_LOOP="http://search.twitter.com/search.json?q=strangeloop&rpp=1000&include_entities=true&result_type=recent",MAP_WIDTH=1200,MAP_HEIGHT=834,LNG_LEFT=-90.2792,LNG_RIGHT=-90.1903,LAT_BOTTOM=38.618,tweetNum;$(document).ready(function(){function n(e){r(e,100,0)}function r(t,n,s){i(t);if(!(s<=n&&t.next_page))return;var o=t.next_page,u="http://search.twitter.com/search.json"+o;s++;$.ajax({url:u,data:e,type:"GET",crossDomain:!0,dataType:"jsonp",success:function(e){r(e,n,s)}})}function i(e){var t=e.results,n=t?t.length:0;for(var r=0;r<n;r++){var i=t[r];if(i.geo){lat=i.geo.coordinates[0];lng=i.geo.coordinates[1];Math.abs(lat)>0&&Math.abs(lng)>0&&o(i,lat,lng)}if(i){console.log(i);s(i)}}}function s(e){$.ajax({type:"POST",url:"_/php/storeTweets.php",data:e,dataType:"json",error:function(e,t,n){console.log(n)},success:function(e){}})}function o(e,n,r){var i=u(n,r),s='<div class="tweetBox" id="tweetBox_'+t+'" style="position:absolute; width:300px; top:'+i[1]+25+"px; left:"+i[0]+25+'px; display:none;" >';s+='<img class="tweetProfPic" src="'+e.profile_image_url_https+'" alt="profile_picture"/>';s+='<div class="tweetUserInfo"><span class="tweetName">'+e.from_user_name+"</span>";s+='<span class="tweetUserName">@'+e.from_user+"</span></div><hr/>";s+='<div class="tweetText">'+e.text+"</div>";s+='<div class="tweetTime">'+e.created_at+"</div>";s+="</div>";$(s).appendTo("body");t++}function u(e,t){var n=LNG_RIGHT-LNG_LEFT,r=LAT_BOTTOM*Math.PI/180,i=(t-LNG_LEFT)*(MAP_WIDTH/n);e=e*Math.PI/180;var s=MAP_WIDTH/n*360/(2*Math.PI),o=s/2*Math.log((1+Math.sin(r))/(1-Math.sin(r))),u=MAP_HEIGHT-(s/2*Math.log((1+Math.sin(e))/(1-Math.sin(e)))-o);if(i>MAP_WIDTH||i<0||u>MAP_WIDTH||u<0)return[0,0];a(i,u);return[i,u]}function a(e,n){var r=10,i=Math.floor(r/2);n-=i;e-=i;var s='<div class="tweetPoint" id="tweetPoint_'+t+'" style="position:absolute; width:'+r+"px; height:"+r+"px; top:"+n+"px; left:"+e+'px; background:rgb(19, 219, 225); color:white; border-radius:5px;"></div>';$(s).appendTo("body");$("#tweetPoint_"+t).hover(function(){f($(this).attr("id"))},function(){})}function f(e){var t=e.split("_")[1],n=$(".visible").attr("id"),r=n?n.split("_")[1]:"";if(t!==r&&r)$(".visible").delay(250).stop().fadeOut(250,function(){$(this).removeClass("visible");$(".selected").removeClass("selected");$("#tweetPoint_"+t).addClass("selected");$("#tweetBox_"+t).addClass("visible").show()});else{$("#tweetPoint_"+t).addClass("selected");$("#tweetBox_"+t).addClass("visible").show()}}function l(e){var t=e.split("_")[1],n=$(".visible").attr("id"),r=n?n.split("_")[1]:"";console.log(t+"vs. "+r);t!==r&&$(".visible").delay(250).stop().fadeOut(250,function(){$(this).removeClass("visible");$(".selected").removeClass("selected")})}var e,t=0;u(38.640691,-90.234922);t++;$.ajax({url:LIVE_TWEETS_STLDW,data:e,type:"POST",crossDomain:!0,dataType:"jsonp",success:function(e){n(e)}});$("body").click(function(){$(".visible").delay(250).stop().fadeOut(250,function(){$(this).removeClass("visible");$(".selected").removeClass("selected")})})});