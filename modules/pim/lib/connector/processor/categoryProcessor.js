/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var Processor 	= require("./processor.js");
var events 		= require("events");
var util 		= require("util");
var moment 		= require('moment');
var mongoose 	= require('mongoose');
var Item        = mongoose.model('category');

function CategoryProcessor(config, jobExecution) {
	/**
	 * @see parent Processor
	 */
	Processor.call(this, config, jobExecution);
}

util.inherits(CategoryProcessor, Processor);

CategoryProcessor.prototype.treat = function(item, last, writerCallback) {
	
	Processor.prototype.treat.call(this, item, last, function(doc, last){
		
		var processed = [];
		processed['code'] = doc.code;
		
		if (!last){
			writerCallback.treat(processed, last);
		}
		
	});
};

module.exports = CategoryProcessor;
