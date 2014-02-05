/*
	Netcat Flume mock server
*/
var net = require('net');
var conf = require('../conf');

net.createServer(function (socket) {
 
  socket.on('connection', function (data) {
	console.log(data);
  });
 
  // Handle incoming messages from clients.
  socket.on('data', function (data) {
	console.log(data.toString());
  });
 
  // Remove the client from the list when it leaves
  socket.on('end', function () {
    console.log('end');
  });
  
  socket.on('error', function (ex) {
    console.log('error:');
	console.log(ex);
  });

 
}).listen(conf.port);

console.log('mock server running on port: ' + conf.port);