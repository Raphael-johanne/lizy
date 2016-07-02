/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */
var Controller 	= require("./controller.js");
var util 		= require("util");

function PassportController() {
	Controller.call(this);
}

util.inherits(PassportController, Controller);

PassportController.controller = function(app, entity) {

	  /* GET login page. */
	  app.get('/', function(req, res) {
		  res.render('pim/page/passport/login.ejs', {templateData : {}, message: req.flash('message')});
	  });
	 
	  /* Handle Login POST */
	  app.post('/login', app.get('passport').authenticate('login', {
	    successRedirect: '/dashboard/index',
	    failureRedirect: '/',
	    failureFlash : true 
	  }));
	  
	  app.get('/signout', function(req, res) {
		  req.logout();
		  res.redirect('/');
	  });
}

module.exports = PassportController;
