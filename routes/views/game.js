var keystone = require('keystone'),
	async = require('async');

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
		
		console.log('11');
		locals.data.games = req.body;
		//handleCmd(view,locals,res,req,httpserver);
		console.log(req.body);
		console.log('--------');
		console.log(locals.data.games);
		next();
		
	});
		
	// Render the view
	view.render('game');
	
};
