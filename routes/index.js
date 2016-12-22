/**
 * This file is where you define your application routes and controllers.
 * 
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 * 
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 * 
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 * 
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 * 
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var _ = require('underscore'),
	keystone = require('keystone'),
	middleware = require('./middleware'),
	importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	api: importRoutes('./api'),
	views: importRoutes('./views'),
	auth: importRoutes('./auth')
};

// Setup Route Bindings
exports = module.exports = function(app) {

	// Views
	app.get('/', routes.views.index);		//首页
	app.get('/bloglist', routes.views.bloglist);  //技能培训
	app.get('/bloglist/:category?', routes.views.bloglist);  //技能培训子目录
	app.get('/bloglist/post/:post', routes.views.post);	//技能培训单独页面
	app.get('/blog', routes.views.blogback); 	//时间轴
	app.get('/blog/:category?', routes.views.blog);  //时间轴子目录
	app.get('/blog/post/:post', routes.views.post);  //时间轴单独页面
    app.get('/candidate', routes.views.candidate); //人才招聘
    app.get('/candidate/:title?', routes.views.candidate);	//人才招聘子目录
    app.get('/candidate/cand/:candid', routes.views.cand);	//人才招聘单独页面
	app.get('/sheet/:customer?', routes.views.sheet);//IT服务
	app.get('/sheet/worksheet/:worksheet', routes.views.worksheet); //IT服务子目录
	app.get('/game', middleware.requireUser, routes.views.game);	//IOT
	//app.post('/runcmd',routes.views.runcmd); //IP扫描
	app.get('/flot', routes.views.flot);	//flot 图表
	app.get('/morris', routes.views.morris);	//morris 图表
	app.get('/gallery', routes.views.gallery);  //图片分享
	app.all('/contact', routes.views.contact);	//留言
	
	// Session
	app.all('/join', routes.views.session.join);
	app.all('/signin', routes.views.session.signin);
	app.get('/signinpop', routes.views.session.signinpop);
	app.get('/signout', routes.views.session.signout);
	app.all('/forgot-password', routes.views.session['forgot-password']);
	app.all('/reset-password/:key', routes.views.session['reset-password']);
	
	// Authentication
	app.all('/auth/confirm', routes.auth.confirm);
	app.all('/auth/app', routes.auth.app);
	app.all('/auth/:service', routes.auth.service);
	
	// User
	app.all('/me*', middleware.requireUser);
	app.all('/me', routes.views.me);

	

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
	
};
