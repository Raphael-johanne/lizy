/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var events 	= require("events");
var util 	= require("util");

function Writer(config) {
	this.config = config;
}

util.inherits(Writer, events.EventEmitter);

Writer.prototype.treat = function(items, last, callback) {
	console.log('write');
};

module.exports = Writer;
