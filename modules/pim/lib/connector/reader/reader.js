/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var events = require("events");
var util = require("util");

function Reader(config, jobExecution) {
	this.config 		= config;
	this.jobExecution 	= jobExecution;
}

util.inherits(Reader, events.EventEmitter);

Reader.prototype.treat = function(processorCallBack, writerCallback) {
	
};

module.exports = Reader;
