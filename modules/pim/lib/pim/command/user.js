/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 * 
 */

/**
 * Example :
 * nodejs console.js pim:user username="admin" email="admin" password="admin" env=dev
 */

var mongoose = require('mongoose');
/*
 * @TODO Fix : no more relative path
 */
require('../models/user');
var Item	 = mongoose.model('user');
var Crypt 	 = require('../../core/services/crypt');

function UserCommand(parameters) {
	this.username 	= parameters.username;
	this.email 		= parameters.email;
	this.password 	= parameters.password;
}

/**
 * Create user
 */
UserCommand.prototype.execute = function() {
	var user = {};
	user.username = this.username;
	user.email = this.email;
	user.password = Crypt.encrypt(this.password);
	
	new Item(user).save(function( err, item, count ){
		if (err) {
		  console.log(err);
		} else {
			console.log('User ' + user.username + " has been created");
	    }
	 });
}

module.exports = UserCommand;