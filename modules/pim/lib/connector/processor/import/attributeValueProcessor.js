 /*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var Processor 	= require("../processor.js");
var events 		= require("events");
var util 		= require("util");
var moment 			= require('moment');
/*
 * @TODO Fix : no more relative path
 */
var coreGlobal 		= require('../../../core/services/config.js');

function AttributeValueProcessor(config, jobExecution) {
	
	/**
	 * @see parent Processor
	 */
	Processor.call(this, config, jobExecution);
	
	/**
	 * @var attributes array will contains all attributes with their options
	 */
	this.attributes =  [];
}

util.inherits(AttributeValueProcessor, Processor);

AttributeValueProcessor.prototype.treat = function(item, last, callback) {
	/**
	 * build attribute options in memory before to try to save them, on last treated item, called writer process
	 */
	if (last === false) {
		if (typeof this.attributes[item.attribute_code] === 'undefined') {
			item.code = item.attribute_code;
			this.attributes[item.attribute_code] = item;
			this.attributes[item.attribute_code].values = [];
		} 
		this.attributes[item.attribute_code].values.push({code:item.option_code, value:item.option_value});
	} else {
		var attributes = this.attributes;

		for(attribute_code in attributes) {
			var attribute = attributes[attribute_code];

			var assignValues = function(attribute){
				this.model.findOne({'code':attribute_code}, {}, function(err, doc){
					
					doc.mdate = moment().format(coreGlobal.getDefaultDateFormat());
					
					doc.values = attribute.values;

					callback.treat(doc, false);
				})
			}.bind(this);
			assignValues(attribute);
		};
	}
};

module.exports = AttributeValueProcessor;