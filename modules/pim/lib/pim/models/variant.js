/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var mongoose = require('mongoose');

var variantSchema = new mongoose.Schema({
	sku   			: { type : String },
	axis 			: { type : Object , "default" : {} },
	products 		: { type : Object , "default" : {} },
	cdate  			: { type : Date, default : Date.now },
	mdate  			: { type : Date, default : Date.now }
});

mongoose.model('variant', variantSchema, 'variant');
