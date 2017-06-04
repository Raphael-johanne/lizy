/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
	code  	: { type : String },
	title 	: { type : String },
	parent 	: { type : String },
	order	: { tyoe : Number },
	cdate 	: { type : Date, default : Date.now },
	mdate 	: { type : Date, default : Date.now }
});

mongoose.model('category', categorySchema, 'category');
