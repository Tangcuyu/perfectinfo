var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = 'sheet';
	locals.filters = {
		worksheet: req.params.worksheet
	};
	locals.data = {
		worksheets: []
	};
	
	// Load the current worksheet
	view.on('init', function(next) {
		
		var q = keystone.list('worksheet').model.findOne({
			state: '发布',
			wid: locals.filters.worksheet
		}).populate('author username');
		
		q.exec(function(err, result) {
			locals.data.worksheet = result;
			next(err);
		});
		
	});
	
	// Load other worksheets
	view.on('init', function(next) {
		
		var q = keystone.list('worksheet').model.find().where('state', '发布').sort('-Date').populate('author').limit('4');
		
		q.exec(function(err, results) {
			locals.data.worksheets = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('worksheet');
	
};
