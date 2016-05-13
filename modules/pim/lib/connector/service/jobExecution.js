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
var NOTIFICATION_CODE 	= "NOTIFICATION";
var notifications 		= [];
var iterator  			= 0;

function jobExecution(options) {
	
	var options = options || {};
	
	this.eventName = (typeof options.eventName !== 'undefined')
		? options.eventName : DEFAULT_EVENT_NAME;	
	
	this.nbrRead 	= 0;
	this.nbrUpdate 	= 0;
	this.nbrCreate 	= 0;
	this.nbrError 	= 0;
}

util.inherits(jobExecution, events.EventEmitter);

jobExecution.prototype.addError = function(message, identifier) {
	this.nbrError++;
	this.emitEvent(ERROR_CODE, message, identifier);
}

jobExecution.prototype.addNotification = function(message) {
	this.emitEvent(NOTIFICATION_CODE, message);
}

jobExecution.prototype.addReadEntry = function() {
	this.nbrRead++;
	this.emitEvent();
}

jobExecution.prototype.addUpdateEntry = function() {
	this.nbrUpdate++;
	this.emitEvent();
}

jobExecution.prototype.addCreateEntry = function() {
	this.nbrCreate++;
	this.emitEvent();
}

jobExecution.prototype.emitEvent = function(code, messages, identifier) {
		
	this.emit(this.eventName, {
		"code"       : code || "",
		"messages"   : messages || "",
		"identifier" : identifier || "",
		"read"		 : this.nbrRead,
		"update"	 : this.nbrUpdate,
		"create"     : this.nbrCreate,
		"error"	 	 : this.nbrError
	});
}

module.exports = jobExecution;