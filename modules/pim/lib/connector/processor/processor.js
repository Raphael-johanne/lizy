/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var events 		= require("events");
var util 		= require("util");
var merge 		= require('merge');
var mongoose 	= require('mongoose');
var moment 		= require('moment');

function Processor(config) {
	this.config = config;
	if (typeof this.config.collection !== 'undefined'
		&& typeof this.config.key !== 'undefined') {
		
		this.model	= mongoose.model(this.config.collection);
		this.key	= this.config.key	   
	} else {
		this.model    = null;
	}
}

util.inherits(Processor, events.EventEmitter);

Processor.prototype.treat = function(item, last, callBack) {
	/**
	 * if model and item provided in config of the profile,
	 * trying to load item
	 */
	if (this.model !== null && item !== null) {
		var conditions = {};
		conditions[this.key] = item[this.key];
		this.model.findOne(conditions, {},function(err, doc){
			
			item.mdate = moment().format('YYYY/MM/DD HH:mm');
			
			if (doc !== null) {
				item = merge(doc, item);
			} else {
				item.cdate = item.mdate;
			}
			callBack(item, last);
		})
	} else {
		/**
		 * @see callBack
		 */
		callBack(item, last);
	}
};

module.exports = Processor;
