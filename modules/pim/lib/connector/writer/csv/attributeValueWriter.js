/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var events 		= require("events");
var util 		= require("util");
var CsvWriter 	= require("./csvWriter.js");

function AttributeValueWriter(config) {
	CsvWriter.call(this, config);
}

util.inherits(AttributeValueWriter, CsvWriter);

module.exports = AttributeValueWriter;
