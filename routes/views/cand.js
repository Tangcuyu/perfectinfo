//时间轴单独页面

var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = 'candidate';
	locals.filters = {
		cand: req.params.candid
	};
	locals.data = {
		cands: []
	};
	
	// Load the current candidate
	view.on('init', function(next) {
		
		var q = keystone.list('Candidate').model.findOne({
			state: 'published',
			candid: locals.filters.cand
		}).populate('title skills precustomer');
		
		q.exec(function(err, result) {
			locals.data.cand = result;
			next(err);
		});
		
	});
	
	
	
	// Load other candidates
	view.on('init', function(next) {
		
		var q = keystone.list('Candidate').model.find().where('state', 'published').sort('-publishedDate').populate('title').limit('4');
		
		q.exec(function(err, results) {
			locals.data.cands = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('cand');
	
};
