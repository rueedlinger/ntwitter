/*
	Collect tweets from public streams by given keywords
*/

var Twit = require('twit');

var conf = require('./conf');
var prettify = require('./util/prettify');
var client = require('./net/client');

var T = new Twit(conf);
var stream = T.stream('statuses/filter', { track: conf.track });

stream.on('tweet', function (tweet) {
	console.log(prettify.toString(tweet));
	client.write(prettify.toJson(tweet));
});