/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var mongoose = require('mongoose');

var jobSchema = new mongoose.Schema({
	code   			: { type : String },
	name	   		: { type : String },
	type	   		: { type : String },
	config		 	: { type : Object , "default" : {} },
	cdate  			: { type : Date, default : Date.now },
	mdate  			: { type : Date, default : Date.now }
});

mongoose.model('job', jobSchema, 'job');
