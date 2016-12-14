var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = 'game';
	locals.user = req.user;
	locals.filters = {
		action: req.query.action
	};
	locals.data = {
	};	
	
	// Render the view
	view.render('game');
	
};
