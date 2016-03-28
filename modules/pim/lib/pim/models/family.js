/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var mongoose = require('mongoose');

var familySchema = new mongoose.Schema({
	code   		: { type : String },
	title  		: { type : String },
	attributes  : { type : Object , "default" : {} },
	cdate  		: { type : Date, default : Date.now },
	mdate  		: { type : Date, default : Date.now }
});

mongoose.model('family', familySchema, 'family');
