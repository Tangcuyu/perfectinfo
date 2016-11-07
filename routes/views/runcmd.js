var keystone = require('keystone');

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
		ips: req.body.ipaddress
	};
	view.on('post',function(next){
		//require("../../lib/runcmd")(server, keystone.req, keystone.res, locals.data);
		next();
	});

	// Render the view
	view.render('runcmd');
	
};
