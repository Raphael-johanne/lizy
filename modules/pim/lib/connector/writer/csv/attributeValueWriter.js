/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var events 		= require("events");
var util 		= require("util");
var CsvWriter 	= require("./csvWriter.js");

function AttributeValueWriter(config, jobExecution) {
	CsvWriter.call(this, config, jobExecution);
}

util.inherits(AttributeValueWriter, CsvWriter);

module.exports = AttributeValueWriter;
