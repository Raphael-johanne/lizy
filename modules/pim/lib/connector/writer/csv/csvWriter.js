/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var events 		= require("events");
var util 		= require("util");
var Writer 		= require("../writer.js");
var fs 			= require("fs");
var csv 		= require("fast-csv");
var csvStream 	= csv.createWriteStream({headers: true});
  
function CsvWriter(config) {
	if (typeof config !== 'undefined') {
		writableStream = fs.createWriteStream(config.path);
		csvStream.pipe(writableStream);
		
		writableStream.on("finish", function(){
			console.log("DONE!");
		});
	}
}

util.inherits(CsvWriter, Writer);

var writer = new CsvWriter();

CsvWriter.prototype.treat = function(item, last) {
	
	csvStream.write(item);
	if (last === true) {
		csvStream.end();
	}
};

module.exports = CsvWriter;
