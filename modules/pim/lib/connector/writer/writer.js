/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var events 	= require("events");
var util 	= require("util");

function Writer(config, jobExecution) {
	this.config 		= config;
	this.jobExecution 	= jobExecution;
}

util.inherits(Writer, events.EventEmitter);

Writer.prototype.treat = function(items, last, callback) {
	console.log('write');
};

module.exports = Writer;
