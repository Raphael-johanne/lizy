/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
	sku   			: { type : String },
	family   		: { type : String },
	categories 	    : { type : Object , "default" : {} },
	normalizedData 	: { type : Object , "default" : {} },
	cdate  			: { type : Date, default : Date.now },
	mdate  			: { type : Date, default : Date.now }
});

mongoose.model('product', productSchema, 'product');
