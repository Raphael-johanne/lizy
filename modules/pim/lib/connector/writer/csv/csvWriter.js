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
  
function CsvWriter(config, jobExecution) {
	Writer.call(this, config, jobExecution);
	
	if (typeof config !== 'undefined') {
		writableStream = fs.createWriteStream(this.config.path);
		csvStream.pipe(writableStream);
		
		writableStream.on("finish", function(){
			this.jobExecution.addNotification("End of profil execution");
		});
	}
}

util.inherits(CsvWriter, Writer);

var writer = new CsvWriter();

/**
 * write an item
 * 
 * @param object  item
 * @param boolean last 
 */
CsvWriter.prototype.treat = function(item, last) {
	csvStream.write(item);
	if (last === true) {
		csvStream.end();
	}
};

module.exports = CsvWriter;
