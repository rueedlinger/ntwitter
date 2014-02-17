var config = {
	// twitter credentials
	consumer_key:         'xxx',
	consumer_secret:      'xxx',
	access_token:         'xxx',
	access_token_secret:  'xxx',
	
	// track this keywords
	track: ['zeugenaufruf', 'verkehrsunfall', 'Verkehrsstau', 'personenschaden'],
	
	// follow this screen names
	follow: ['TCSverkehrA1', 'TCSVerkehrA2', 'TCSVerkehrA3', 'KapoGR', 'StapoSG', 'StadtpolizeiZH', 'PoliceBern', 'POLIZEI_SCHWEIZ', 'railinfo_sbb'],	

	// server and port where the collected tweets should be send to
	host: 'localhost',
	port: 8124
};

module.exports = config;