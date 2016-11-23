var io = require('socket.io')();
module.exports = function(server){
	io = io.attach(server);

	return io;
};