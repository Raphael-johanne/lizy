/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var events 		= require("events");
var util 		= require("util");
var CsvWriter 	= require("./csvWriter.js");

function CategoryWriter(config) {
	CsvWriter.call(this, config);
}

util.inherits(CategoryWriter, CsvWriter);

module.exports = CategoryWriter;
