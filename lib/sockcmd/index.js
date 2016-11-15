module.exports = function(io){
	var socketcmd = require('./lib/socketCmd');
	socketcmd.start(io);

};