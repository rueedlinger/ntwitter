

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

	var out = id + '\t' + created.getFullYear() + '\t' + (created.getMonth() + 1) + '\t' + created.getDate() + '\t'
		+ updated.getFullYear() + '\t' + (updated.getMonth() + 1) + '\t' + updated.getDate() + '\t'
		+ userName + '\t' + userId + '\t'  + text + '\t' 
		+  lang + '\t' + rcount + '\t' + followers + '\n';
	return out;
}


