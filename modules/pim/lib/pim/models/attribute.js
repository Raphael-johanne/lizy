/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var mongoose = require('mongoose');

var attributeSchema = new mongoose.Schema({
	code   : { type : String },
	title  : { type : String },
	type   : { type : String },
	values : { type : Object , "default" : [] },
	cdate  : { type : Date, default : Date.now },
	mdate  : { type : Date, default : Date.now }
});

mongoose.model('attribute', attributeSchema, 'attribute');
