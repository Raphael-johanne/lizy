/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var events 				= require("events");
var util 				= require("util");
var DEFAULT_EVENT_NAME 	= "job_execution_report";
var ERROR_CODE 			= "ERROR";
var WARNING_CODE 		= "WARNING";
var SUCCESS_CODE 		= "SUCCESS";
var NBR_ITEM_TO_EMIT    = 100;
var iterator 			= 0;
var notifications 		= [];

function jobExecution(options) {
	
	var options = options || {};
	
	this.eventName = (typeof options.eventName !== 'undefined')
		? options.eventName : DEFAULT_EVENT_NAME;	
}

util.inherits(jobExecution, events.EventEmitter);

jobExecution.prototype.addErrors = function(messages, identifier) {
	this.emitEvent(ERROR_CODE, messages, identifier);
}

jobExecution.prototype.emitEvent = function(code, messages, identifier) {
	
	iterator++;
	
	if(iterator >= NBR_ITEM_TO_EMIT) {
		this.emit(this.eventName, notifications);
		notifications = [];
		iterator = 0;
	} else {
		notifications.push({
			"code"       : code,
			"messages"   : messages,
			"identifier" : identifier
		}) 
	}
}

module.exports = jobExecution;