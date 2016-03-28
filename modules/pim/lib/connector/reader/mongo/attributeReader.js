/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

require('../../../pim/models/attribute');
var Reader 		= require("reader.js");
var util 		= require("util");
var mongoose 	= require('mongoose');
var model     	= mongoose.model('attribute');

function AttributeReader(config) {
	Reader.call(this, config);
}

util.inherits(AttributeReader, Reader);

var reader = new AttributeReader();

AttributeReader.prototype.treat = function(processorCallBack, writerCallback) {
	reader.find(model, {}, 'code title type cdate mdate', function(docs){	
		var nb = docs.length - 1;
		docs.forEach(function(item, index){
			var last = (index == nb) ? true : false;
			processorCallBack.treat(item, last, writerCallback);
		});
	});
} ;

module.exports = AttributeReader;
