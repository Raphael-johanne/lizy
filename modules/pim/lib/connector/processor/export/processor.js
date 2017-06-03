/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var events 			= require("events");
var util 			= require("util");
var merge 			= require('merge');
var mongoose 		= require('mongoose');
var moment 			= require('moment');
/*
 * @TODO Fix : no more relative path
 */
var coreGlobal 		= require('../../../core/services/config.js');

function Processor(config, jobExecution) {
	this.config 		= config;
	this.jobExecution 	= jobExecution;
	
	if (typeof this.config.collection 	!== 'undefined'
		&& typeof this.config.key 		!== 'undefined') {
		
		this.model	= mongoose.model(this.config.collection);
		this.key	= this.config.key;	   
		
	} else {
		this.model	= null;
	}
}

util.inherits(Processor, events.EventEmitter);
