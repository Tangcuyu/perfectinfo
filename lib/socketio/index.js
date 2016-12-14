var socketCmd = require('./sockip/socketCmd'),
	resultStore = require('./sockip/resultStore');

module.exports = function(keystone){
	//Create scan_ip name-space, waiting for socket client's connection
	var io = keystone.io;
	var scanIPaddressSocket = io.of('/scan_ip')
		.on('connection', function(socket){	
			console.log('ScanIP connected.');
			//通知客户端已连接
			//socket.emit('adminopen', locals.user.name.first); 
			
			 // 构造客户端对象
			var client = {
				socket:socket,
				name: false
			};
			
			
			socket.on('cmd_submit',function(data){

				var cmdparms = JSON.parse(data);
				socketCmd.start(socket, cmdparms);

			});
					
						
			socket.on('cmd_kill', function(data){
				var cmdparms = JSON.parse(data);
				socketCmd.kill();
			});

			socket.on('disconnect', function(){
		/* 						var obj = {
									author: 'system',
									text: locals.user.name.first,
									type: 'disconnect'
								};*/
								console.log('ScanIP disconnect!');
								//console.log(socket);
					});
		});
		
	
	/* var windPowerSocket = io.of('/wind_power')
		.on('connection',function(socket){
			console.log('A client connected to wind_power namespace.');
		});
	 */
};