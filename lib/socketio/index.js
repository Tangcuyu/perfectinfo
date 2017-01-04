var socketCmd = require('./sockip/socketCmd');

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
			var pid;			
			socket.on('cmd_submit',function(data){

				var cmdparms = JSON.parse(data);
				pid = socketCmd.start(socket, cmdparms);
			});
					
						
			socket.on('cmd_kill', function(data){
				var cmdparms = JSON.parse(data);
				console.log(pid);
				try{
					socketCmd.kill(socket, pid);
				}catch(err){
					console.log('Process:' + pid + ' not exist!')
				}
			});

			socket.on('disconnect', function(){
								console.log('ScanIP disconnect!');
					});
		});
	
	/* var windPowerSocket = io.of('/wind_power')
		.on('connection',function(socket){
			console.log('A client connected to wind_power namespace.');
		});
	 */
};