var net = require('net');

var conf = require('../conf');

var client = net.connect({port: conf.port},
    function() { 
	//'connect' listener
	console.log('client connected');
});

client.on('error', function(err) {
  console.log(err);
});


module.exports = client;