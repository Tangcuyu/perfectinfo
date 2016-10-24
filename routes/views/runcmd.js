var keystone = require('keystone'),
	async = require('async');
var handleCmd = require('../../lib/runcmd');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = 'IPSCAN';
	locals.filters = {
		action: req.params.action
	};
	locals.data = {
		ips: []
	};
	
	// On POST requests, add run the masscan on server
	view.on('post', { action: 'runcmd' }, function(next) {
		
		handleCmd(view,locals,res,req,httpserver);
		
	});
		
	// Render the view
	view.render('game');
	
};
