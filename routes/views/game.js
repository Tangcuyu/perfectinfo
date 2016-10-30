var keystone = require('keystone'),
	async = require('async'),
	handleCmd = require('../../lib/runcmd');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = 'game';
	locals.filters = {
		action: req.query.action
	};
	locals.data = {
		games: []
	};
	
	// On POST requests, add run the masscan on server
	view.on('post', { action: 'game' }, function(next) {
		locals.data.games = req.body;
		handleCmd(keystone,locals);
		next();
		
	});
		
	// Render the view
	view.render('game');
	
};
