var io = require('socket.io'),
	socketCmd = require('./sockip/socketCmd');
exports.init = function(server){
	io = io.listen(server);
	
	var scanIPaddressSocket = io.of('/scan_ip')
		.on('connection',function(socket){
			console.log('A client connected to scan_ip namespace.');
			socket.on('cmd_submit',function(data){
				var cmdparms = data.split('&');
				socketCmd.start(socket, cmdparms);
					//socket.send(JSON.stringify(data));
				
			});
		});
	var windPowerSocket = io.of('/wind_power')
		.on('connection',function(socket){
			console.log('A client connected to wind_power namespace.');
		});
};