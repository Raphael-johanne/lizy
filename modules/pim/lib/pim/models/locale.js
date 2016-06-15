/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var mongoose = require('mongoose');

var localeSchema = new mongoose.Schema({
	code   			: { type : String },
	name   			: { type : String },
	status   		: { type : String },
	cdate  			: { type : Date, default : Date.now },
	mdate  			: { type : Date, default : Date.now }
});

mongoose.model('locale', localeSchema, 'locale');
