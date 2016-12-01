var keystone = require('keystone'),
	socketCmd = require('../../lib/socketio/sockip/socketCmd');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		io = keystone.io,
		locals = res.locals;
	
	// Set locals
	locals.section = 'game';
	locals.filters = {
		action: req.query.action
	};
	locals.data = {
	};	
	//Create scan_ip name-space, waiting for socket client's connection
	var scanIPaddressSocket = io.of('/scan_ip')
		.on('connection',function(socket){
			console.log('A client connected to scan_ip namespace.');
			socket.on('cmd_submit',function(data){
				var cmdparms = JSON.parse(data);
				socketCmd.start(socket, cmdparms);
			});
			socket.on('cmd_kill', function(data){
				var cmdparms = JSON.parse(data);
				socketCmd.kill(socket, cmdparms);
			});
		});
	var windPowerSocket = io.of('/wind_power')
		.on('connection',function(socket){
			console.log('A client connected to wind_power namespace.');
		});
	
	// Render the view
	//io.init(server);
	view.render('game');
	
};
