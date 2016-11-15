var keystone = require('keystone'),
	io = require('../../lib/socketio/sockets.js');

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
	
	// Render the view
	io.init(server);
	view.render('game');
	
};
