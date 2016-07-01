/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username   		: { type : String },
	password	    : { type : String },
	email	   		: { type : String },
	cdate  			: { type : Date, default : Date.now },
	mdate  			: { type : Date, default : Date.now }
});

mongoose.model('user', userSchema, 'user');



