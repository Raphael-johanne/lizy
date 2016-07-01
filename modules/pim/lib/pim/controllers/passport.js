/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */
var Controller 			= require("./controller.js");
var util = require("util");

function PassportController() {
	Controller.call(this);
}

util.inherits(PassportController, Controller);

PassportController.controller = function(app, entity) {

	  /* GET login page. */
	  app.get('/', function(req, res) {
		  res.render('pim/page/passport/login.ejs');
	  });
	 
	  /* Handle Login POST */
	  app.post('/login', app.get('passport').authenticate('login', {
	    successRedirect: '/dashboard/index',
	    failureRedirect: '/',
	    failureFlash : true 
	  }));
	 
	  /* GET Registration Page */
	  app.get('/signup', function(req, res){
	    res.render('register',{message: req.flash('message')});
	  });
	 
	  /* Handle Registration POST */
	  app.post('/signup', app.get('passport').authenticate('signup', {
	    successRedirect: '/dashboard/index',
	    failureRedirect: '/signup',
	    failureFlash : true 
	  }));
}

module.exports = PassportController;
