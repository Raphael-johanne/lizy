/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

/**
 * Change this value to swith to another env, will be looking for files in pim core module config files
 * @see pim\lib\core\services\global.js
 */
var ENV = 'dev';

var express 			= require('express')
      ,http 			= require('http')
      ,path 			= require('path')
      ,session 			= require('express-session')
      ,fs 				= require('fs')
      ,configService 	= require('./modules/pim/lib/core/services/config.js');

app = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var mongoose = require('mongoose');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('root', __dirname);

app.use(express.static(path.join(__dirname, 'public')));

var config = configService.getConfigByEnv(ENV);

if (config === false) {
	console.log('Fatal error: the pim configuration is not correct, please refer to your env and configuration file in pim core module.');
} else {
	app.set('port', config.application.port);
	app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 * 60 * 24 }}));
	
	//load modules
	var i18n = require('i18n-2');

	// Attach the i18n property to the express request object
	// And attach helper methods for use in templates
	i18n.expressBind(app, {
	    // setup some locales - other locales default to en silently
	    locales: ['en', 'de', 'fr'],
	    // change the cookie name from 'lang' to 'locale'
	    cookieName: 'locale'
	});

	app.use(function(req, res, next) {
	    req.i18n.setLocaleFromCookie();
	    next();
	});
	
	// database connection
	mongoose.connect(config.mongodb.protocol +'://' + config.mongodb.host  + ':' + config.mongodb.port + '/' + config.mongodb.database);

	// dynamically include routes (Controller)
	fs.readdirSync('./modules/pim/lib/pim/controllers').forEach(function (file) {
	  var entity = file.substring(0, file.lastIndexOf('.'));
	  if(file.substr(-3) == '.js') {
	      var route = require('./modules/pim/lib/pim/controllers/' + file);
	      route.controller(app, entity);
	      
	      app._router.stack.forEach(function(r){
	    	  if (r.route && r.route.path){
	    	  //  console.log(r.route.path)
	    	  }
	    	})
	  }
	});

	var httpd = http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});

	/** 
	 * build default io socket for the pim
	 */
	var io = require('socket.io').listen(httpd, { log: false });
	app.set('io_default', io);
}