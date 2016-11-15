var keystone = require('keystone'),
	runcmd = require('../../lib/sockcmd'),
	io = require('socket.io');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		server = keystone.httpServer,
		locals = res.locals;
	
	// Set locals
	locals.section = 'IPSCAN';
	locals.filters = {
		action: req.params.action
	};
	locals.data = {
		ips: req.body.ipaddress,
		ports: req.body.ports,
		packages: req.body.packages,
		sourceip: req.body.sourceip
	};
	console.log(locals.data);
	
	view.on('post',{action: 'runcmd'},function(next){
		//runcmd(io(server));
		next();
	});
	// Render the view
	view.render('runcmd');
	runcmd(io(server));
	
};
