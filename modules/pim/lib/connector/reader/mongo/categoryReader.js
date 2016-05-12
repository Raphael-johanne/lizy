/*!
 * Copyright(c) Raphael Colboc 
 * MIT Licensed
 */

require('../../../pim/models/category');
var Reader 		= require("reader.js");
var util 		= require("util");
var mongoose 	= require('mongoose');
var model     	= mongoose.model('category');

function CategoryReader(config, jobExecution) {
	Reader.call(this, config, jobExecution);
}

util.inherits(CategoryReader, Reader);

var reader = new CategoryReader();

CategoryReader.prototype.treat = function(processorCallBack, writerCallback) {
	reader.find(model, {}, 'code title cdate mdate', function(docs){	
		var nb = docs.length - 1;
		docs.forEach(function(item, index){
			
			var last = (index == nb) ? true : false;
			processorCallBack.treat(item, last, writerCallback);
		});
	});
} ;

module.exports = CategoryReader;
