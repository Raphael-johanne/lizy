/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var Processor 	= require("./processor.js");
var events 		= require("events");
var util 		= require("util");

function AttributeProcessor(config, jobExecution) {
	/**
	 * @see parent Processor
	 */
	Processor.call(this, config, jobExecution);
}

util.inherits(AttributeProcessor, Processor);

AttributeProcessor.prototype.treat = function(item, last, writerCallback) {
	
	Processor.prototype.treat.call(this, item, last, function(doc, last){
		/**
		 * example of override a proceed item, item can come from database or be a new entry.
		 * doc.name = foo;
		 * @todo must be an availabe type
		 */
		if (!last){
			writerCallback.treat(doc, last);
		}
	});
};

module.exports = AttributeProcessor;