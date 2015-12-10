var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
	locals.section = 'sheet';
	locals.filters = {
		customer: req.params.customer
	};
	locals.data = {
		worksheets: [],
		customers: []
	};
	
	// Load all Customer
	view.on('init', function(next) {
		
		keystone.list('Customer').model.find().sort('CustomerName').exec(function(err, results) {
			
			if (err || !results.length) {
				return next(err);
			}
			
			locals.data.customers = results;
			
			// Load the counts for each Customer
			async.each(locals.data.customers, function(customer, next) {
				
				keystone.list('worksheet').model.count().where('username').in([customer.id]).exec(function(err, count) {
					customer.postCount = count;
					next(err);
				});
				
			}, function(err) {
				next(err);
			});
			
		});
		
	});
	
	// Load the current customer filter
	view.on('init', function(next) {
		
		if (req.params.customer) {
			keystone.list('Customer').model.findOne({ key: locals.filters.customer }).exec(function(err, result) {
				locals.data.customer = result;
				next(err);
			});
		} else {
			next();
		}
		
	});
	
	// Load the worksheets
	view.on('init', function(next) {
		
		var q = keystone.list('worksheet').paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 10
			})
			.where('state', '发布')
			.sort('-Date')
			.populate('author username');
		
		if (locals.data.customer) {
			q.where('username').in([locals.data.customer]);
		}
		
		q.exec(function(err, results) {
			locals.data.worksheets = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('sheet');
	
};
