/*
	Fetch tweets from specify users
*/

var Twit = require('twit');

var conf = require('./conf');
var prettify = require('./util/prettify');
var client = require('./net/client');

var T = new Twit(conf);

// close client connection after a timeout
client.setTimeout(5000, function() {
	console.log('timeout... closing client connection');
	client.end();
});

// fetch the last tweets from the followers 
for(var j = 0; j < conf.follow.length; j++) {
	var screenName = conf.follow[j];
		
	T.get('statuses/user_timeline', { screen_name: screenName, count: 200, exclude_replies: true }, function(err, reply) {
	  var max = reply.length;
	  for(var i = 0; i < max; i++) {
		var tweet = reply[i];
		console.log(prettify.toString(tweet));	
		client.write(prettify.toJson(tweet));
	  }  
	});	
}

