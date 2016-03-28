/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var Processor 	= require("./processor.js");
var events 		= require("events");
var util 		= require("util");
var moment 		= require('moment');

function AttributeProcessor(config) {
	Processor.call(this, config);
}

util.inherits(AttributeProcessor, Processor);

AttributeProcessor.prototype.treat = function(item, last, writerCallback) {
	var processed = {
			code  : item.code,
			title : item.title,
			type  : item.type,
			cdate : moment(item.cdate).format('YYYY-DD-MM HH:mm:ss'),
			mdate : moment(item.mdate).format('YYYY-DD-MM HH:mm:ss')
		};
	Processor.prototype.treat.call(this, processed, last, writerCallback);
};

module.exports = AttributeProcessor;
