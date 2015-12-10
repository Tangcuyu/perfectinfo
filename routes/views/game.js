var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = 'game';
	locals.data = {
		games: []
	};



	// Load other posts
	view.on('init', function(next) {
		
		var q = keystone.list('game').model.find();
		
		q.exec(function(err, results) {
			locals.data.games = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('game');
	
};
