/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var events 		= require("events");
var util 		= require("util");
var CsvWriter 	= require("./csvWriter.js");

function AttributeWriter(config) {
	CsvWriter.call(this, config);
}

util.inherits(AttributeWriter, CsvWriter);

module.exports = AttributeWriter;
