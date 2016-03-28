 /*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var Processor 	= require("./processor.js");
var events 		= require("events");
var util 		= require("util");

function AttributeValueProcessor(config) {
	
	/**
	 * @see parent Processor
	 */
	Processor.call(this, config);
	
	/**
	 * @var attributes array will contains all attributes with their options
	 */
	this.attributes =  [];
}

util.inherits(AttributeValueProcessor, Processor);

AttributeValueProcessor.prototype.treat = function(item, last, writerCallback) {
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
		var i = 1;
		for(attribute_code in attributes) {
			var attribute = attributes[attribute_code];
			var assignValues = function(attribute){
				Processor.prototype.treat.call(this, attribute, last, function(doc, last){
					
					if (typeof doc._id === 'undefined') {
						console.log(attribute.code);
						return null;
					}
					
					if (doc.type !== 'select') {
						console.log(attribute.code);
						return null;
					}
					
					doc.values = attribute.values;
					writerCallback.treat(doc, last);
				});
			}.bind(this);
			assignValues(attribute);
		};
	}
};

module.exports = AttributeValueProcessor;