var net = require('net');

net.createServer(function (socket) {
 
  // Identify this client
  socket.name = socket.remoteAddress + ":" + socket.remotePort 
 
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

 
}).listen(8124);

console.log('server running...');