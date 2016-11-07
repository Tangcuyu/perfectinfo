var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		server = keystone.httpServer,
		locals = res.locals;
	
	// Set locals
	locals.section = 'game';
	locals.filters = {
		action: req.query.action
	};
	locals.data = {
		games: []
	};
	require("../../lib/runcmd")(server, keystone.req, keystone.res);
	// Render the view
	view.render('game');
	
};
