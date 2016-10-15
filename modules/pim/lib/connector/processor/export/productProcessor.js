 /*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var Processor	= require("../processor.js");
var events 		= require("events");
var util 		= require("util");
var mongoose	= require('mongoose');
var Family  	= mongoose.model('family');
var merge 		= require('merge');

function ProductProcessor(config, jobExecution) {
	
	/**
	 * @see parent Processor
	 */
	Processor.call(this, config, jobExecution);
}

util.inherits(ProductProcessor, Processor);

ProductProcessor.prototype.treat = function(item, last, writerCallback) {
	
	Family.findById(item.family, function(err, family) {
		  if (err) {
			  console.log(err);
		  } else {
			  var product 		= {};
			  product.sku		= item.sku;
			  product.cdate 	= item.cdate;
			  product.mdate 	= item.mdate;
			  product.family 	= family.code;
			  product 			= merge(item.normalizedData, product);
			  writerCallback.treat(product, last);
		  }
	});
};

module.exports = ProductProcessor;
