/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var events 		= require("events");
var util 		= require("util");
var CsvWriter 	= require("./csvWriter.js");

function AttributeWriter(config, jobExecution) {
	CsvWriter.call(this, config, jobExecution);
}

util.inherits(AttributeWriter, CsvWriter);

module.exports = AttributeWriter;
