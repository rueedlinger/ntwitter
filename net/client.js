var net = require('net');


var client = net.connect({port: 8124},
    function() { 
	//'connect' listener
	console.log('client connected');
});

module.exports = client;