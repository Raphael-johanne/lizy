/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var events = require("events");
var util = require("util");

function Reader(config) {
	this.config = config;
}

util.inherits(Reader, events.EventEmitter);

Reader.prototype.treat = function(processorCallBack, writerCallback) {
	
};

module.exports = Reader;
