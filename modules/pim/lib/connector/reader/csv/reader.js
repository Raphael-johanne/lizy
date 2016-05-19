/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var events 		= require("events");
var util 		= require("util");
var Reader 		= require("../reader.js");
var fs 			= require("fs");
var csv 		= require("fast-csv");
var csvStream 	= csv.createWriteStream({headers: true});

function CsvReader(config, jobExecution) {
	Reader.call(this, config, jobExecution);
}

util.inherits(CsvReader, Reader);

CsvReader.prototype.treat = function(processorCallBack, writerCallback) {
	
	var stream = fs.createReadStream(this.config.path + '.csv');
	
	var csvStream = csv({headers: true})
	    .on("data", function(data){
	    	processorCallBack.treat(data, false, writerCallback);
	    }.bind(this))
	    .on("end", function(){
	    	processorCallBack.treat(null, true, writerCallback);
	    });
	 
	stream.pipe(csvStream);
};

module.exports = CsvReader;
