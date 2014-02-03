var config = {
	// twitter credentials
    consumer_key:         'REPLACE',
	consumer_secret:      'REPLACE',
	access_token:         'REPLACE',
	access_token_secret:  'REPLACE',
	
	// track this keywords
	track: ['superbowl', 'football'],
	
	// follow this screen names
	follow: ['SuperBowl', 'Vikings'],
	
	// server and port where the collected tweets should be send to
	host: 'localhost',
	port: 8124
};

module.exports = config;