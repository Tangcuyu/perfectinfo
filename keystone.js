// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone = require('keystone'),
	pkg = require('./package.json'),
	io = require('socket.io'),
	socketio = require('./lib/socketio');

// set up handlebars view engine
/* var handlebars = require('express3-handlebars').create({
    defaultLayout:'default',
    helpers: {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
}); */

var realtimeport = {
			http: process.env.PORT,
			tcp: process.env.TPORT
		};
		


//Initialize keystone module
keystone.init({

	'name': 'PerfectInfo',
	'brand': 'PerfectInfo',
	
	'less': 'public',
	'static': 'public',
	'favicon': 'public/itsi_64.ico',
	//'views': 'views', handlebars view folder
	'views': 'templates/views',
	'view engine': 'jade',
	
	'emails': 'templates/emails',
	'mongo': process.env.MONGO_URI || 'mongodb://localhost/' + pkg.name,
	
	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': 'k?=gXS2qoDofBV6tvN(#Sn<H-58265tCbo"xGU5`"C5y,W6!tb!k!znVd@LvRaLH'

});

// Setup handlebars engine
//keystone.set('view engine', 'handlebars');
//keystone.set('custom engine',handlebars.engine);


// Load your project's Models
keystone.import('models');

 
// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

// Load your project's Routes

keystone.set('routes', require('./routes'));

// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.

keystone.set('email locals', {
	logo_src: '/images/logo-email.gif',
	logo_width: 194,
	logo_height: 76,
	theme: {
		email_bg: '#f9f9f9',
		link_color: '#2697de',
		buttons: {
			color: '#fff',
			background_color: '#2697de',
			border_color: '#1a7cb7'
		}
	}
});

// Setup replacement rules for emails, to automate the handling of differences
// between development a production.

// Be sure to update this rule to include your site's actual domain, and add
// other rules your email templates require.

keystone.set('email rules', [{
	find: '/images/',
	replace: (keystone.get('env') == 'production') ? 'http://www.your-server.com/images/' : 'http://localhost:3000/images/'
}, {
	find: '/keystone/',
	replace: (keystone.get('env') == 'production') ? 'http://www.your-server.com/keystone/' : 'http://localhost:3000/keystone/'
}]);

// Load your project's email test routes

keystone.set('email tests', require('./routes/emails'));

// Configure the navigation bar in Keystone's Admin UI

keystone.set('nav', {
	'用户管理': 'users',
	'客户管理':'customers',
	'IP地址扫描':'IPaddress',
	'工单': 'worksheets',
	'课程': ['posts', 'post-categories'],
	'人才招聘':['Candidate','TitleCategory','SkillCategory'],
	'图片库': 'galleries',
    'HTML5游戏':'games',
	'留言板': 'enquiries'
});

// Start Keystone to connect to your database and initialise the web server
// Inject the socksd module to start();
keystone.start({
	onHttpServerCreated: function(){
						keystone.io = io(keystone.httpServer);
						console.log('SocketIO server started.');
						socketio(keystone);
					} 
});





