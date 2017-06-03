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
var coreGlobal 		= require('../../core/services/config.js');

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

Processor.prototype.treat = function(item, last, callBack) {
	/**
	 * if model and item are provided in profile configuration and item is not loaded
	 * trying to load it
	 */
	if (this.model !== null 
			&& item !== null
			&& typeof item[this.key] !== 'undefined'
		) {
		var conditions = {};
		conditions[this.key] = item[this.key];
		
		this.model.findOne(conditions, {}, function(err, doc){
			
			item.mdate = moment().format(coreGlobal.getDefaultDateFormat());
			
			if (doc !== null) {
				item = merge(doc, item);
			} else {
				item.cdate = item.mdate;
			}
			
			callBack.treat(item, last);
		})
	} else {
		/**
		 * @see Profile configuration to know witch writer is used
		 */
		callBack.treat(item, last);
	}
};

module.exports = Processor;
