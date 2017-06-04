/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var Processor 	= require("./processor.js");
var events 			= require("events");
var util 			= require("util");
var merge 			= require('merge');
var mongoose 		= require('mongoose');
var moment 			= require('moment');
/*
 * @TODO Fix : no more relative path
 */
var coreGlobal 		= require('../../../core/services/config.js');

function CategoryProcessor(config, jobExecution) {
	
	/**
	 * @see parent Processor
	 */
	Processor.call(this, config, jobExecution);
	
}

util.inherits(CategoryProcessor, Processor);

CategoryProcessor.prototype.treat = function(item, last, callback) {

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

			this.model.findOne({code:item.parent}, function(err, parent){
				if (err) console.log('Parent unknow');
				
				item.parent = (parent === null) ? parent : parent._id;
				
				callback.treat(item, last);
			});
		})
	}
};

module.exports = CategoryProcessor;
