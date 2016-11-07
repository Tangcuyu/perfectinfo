var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
	locals.section = 'candidate';
	locals.filters = {
		title: req.params.title
	};
	locals.data = {
		candidates: [],
		titles: []
	};
	
	// Load all titles
	view.on('init', function(next) {
		
		keystone.list('TitleCategory').model.find().sort('name').exec(function(err, results) {
			
			if (err || !results.length) {
				return next(err);
			}
			
			locals.data.titles = results;
			
			// Load the counts for each title
			async.each(locals.data.titles, function(title, next) {
				
				keystone.list('Candidate').model.count().where('title').in([title.id]).exec(function(err, count) {
					title.postCount = count;
					next(err);
				});
				
			}, function(err) {
				next(err);
			});
			
		});
		
	});
	
	// Load the current title filter
	view.on('init', function(next) {
		
		if (req.params.title) {
			keystone.list('TitleCategory').model.findOne({ key: locals.filters.title }).exec(function(err, result) {
				locals.data.title = result;
				next(err);
			});
		} else {
			next();
		}
		
	});
	
	// Load the candidates
	view.on('init', function(next) {
		
		var q = keystone.list('Candidate').paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 10
			})
			.where('state', 'published')
			.sort('-publishedDate')
			.populate('title skills');
			
		if (locals.data.title) {
			q.where('title').in([locals.data.title]);
		}
		
		q.exec(function(err, results) {
			locals.data.candidates = results;
			next(err);
		});
		
	});
	
	
	// Load the first post
	view.on('init', function(next) {
		
		var fq = keystone.list('Candidate').model.findOne()
			.where('state', 'published')
			.sort('-publishedDate')
			.populate('name title precustomer');
			
		fq.exec(function(err, result) {
			locals.data.candidate = result;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('candidate');
	
};
