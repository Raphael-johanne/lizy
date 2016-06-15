/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var mongoose = require('mongoose');

var channelSchema = new mongoose.Schema({
	code   			: { type : String },
	name   			: { type : String },
	status   		: { type : String },
	locales	 		: { type : Object , "default" : {} },
	cdate  			: { type : Date, default : Date.now },
	mdate  			: { type : Date, default : Date.now }
});

mongoose.model('channel', channelSchema, 'channel');
