



function toXsvFormat(tweet, delim) {
	var created =  new Date(Date.parse(tweet.created_at));
	var updated = new Date();
	var id = tweet.id_str;
	var text = tweet.text.replace(delim,' ').replace('#', '');
	var lang = tweet.lang;
	var rcount = tweet.retweet_count;
	var user = tweet.user;
	var userId = user.id_str;
	var userName = user.screen_name.replace('\t',' ');
	var followers = user.followers_count;

	var out = id + delim + created.getFullYear() + delim + (created.getMonth() + 1) + delim + created.getDate() + delim
		+ updated.getFullYear() + delim + (updated.getMonth() + 1) + delim + updated.getDate() + delim
		+ userName + delim + userId + delim  + text + delim 
		+  lang + delim + rcount + delim + followers;
	return out  + '\n';
}

function toJson(tweet) {
	var created =  new Date(Date.parse(tweet.created_at));
	var updated = new Date();
	var id = tweet.id_str;
	var text = tweet.text.replace('\t',' ').replace('#', '');
	var lang = tweet.lang;
	var rcount = tweet.retweet_count;
	var user = tweet.user;
	var userId = user.id_str;
	var userName = user.screen_name.replace('\t',' ');
	var followers = user.followers_count;

	var out = {
		id: id,
		createdYear: created.getFullYear(),
		createdMonth: (created.getMonth() + 1),
		createdDay:  created.getDate(),
		updatedYear:  updated.getFullYear(),
		updatedMonth: (updated.getMonth() + 1),
		updatedDay: updated.getDate(),
		userName: userName,
		userId: userId,
		text: text,
		lang: lang,
		rcount: rcount,
		followers: followers
	};
	
	return JSON.stringify(out) + '\n';
}

module.exports.toCsvFormat = function(tweet) {
	return toXsvFormat(tweet, ';');
}

module.exports.toTsvFormat = function(tweet) {
	return toXsvFormat(tweet, '\t');
}

module.exports.toString = function(tweet) {
	var created =  new Date(Date.parse(tweet.created_at));
	var updated = new Date();
	var id = tweet.id_str;
	var text = tweet.text.replace('\t',' ').replace('#', '');
	var lang = tweet.lang;
	var rcount = tweet.retweet_count;
	var user = tweet.user;
	var userId = user.id_str;
	var userName = user.screen_name.replace('\t',' ');
	var followers = user.followers_count;

	var out = 'tweet: ' + id + ' from the ' + created.toJSON()  + ' by user ' + userName + ' (' + userId + ')';
	return out + '\n';
}

module.exports.toJson = function(tweet) {
	return toJson(tweet);
}

module.exports.toFlumeEventJson = function(tweet) {
	var created =  new Date(Date.parse(tweet.created_at));
	var updated = new Date();
	var id = tweet.id_str;
	var text = tweet.text.replace('\t',' ').replace('#', '');
	var lang = tweet.lang;
	var rcount = tweet.retweet_count;
	var user = tweet.user;
	var userId = user.id_str;
	var userName = user.screen_name.replace('\t',' ');
	var followers = user.followers_count;

	var body = {
		id: id,
		createdYear: created.getFullYear(),
		createdMonth: (created.getMonth() + 1),
		createdDay:  created.getDate(),		
		userName: userName,
		userId: userId,
		text: text,
		lang: lang,
		rcount: rcount,
		followers: followers
	};
	
	var event = {
		timestamp: updated.getTime(),
		body: body
	};
	
	return JSON.stringify(event);
}
