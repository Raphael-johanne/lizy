/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var events 		= require("events");
var util 		= require("util");
var Reader 		= require("../reader.js");
var mongoose 	= require('mongoose');

function MongoReader(config, jobExecution) {
	Reader.call(this, config, jobExecution);
	
	if (typeof this.config.collection !== 'undefined') {
		this.model	= mongoose.model(this.config.collection);
	} else {
		this.jobExecution.addError("Collection is not defined for the current running import/export profile");
	}
}

util.inherits(MongoReader, Reader);

MongoReader.prototype.treat = function(processorCallBack, writerCallback) {
	this.model.find({}, this.config.fields, function(err, docs) {
		  if (err) throw (err);
		  return processorCallBack(docs);
		}
	);
};

module.exports = MongoReader;
