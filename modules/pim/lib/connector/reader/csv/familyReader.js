/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var events 		= require("events");
var util 		= require("util");
var CsvReader 	= require("./reader.js");
var fs 			= require("fs");
var csv 		= require("fast-csv");

function FamilyReader(config) {
	CsvReader.call(this, config);
}

util.inherits(FamilyReader, CsvReader);

FamilyReader.prototype.treat = function(processorCallBack, writerCallback) {

	var familyFiles = fs.readdir(this.config.path, function(err, files){
		files.forEach(function(file, index){
			
			var stream = fs.createReadStream(this.config.path +'/'+ file);
			 
			var csvStream = csv({headers: true})
			    .on("data", function(data){
			    	
			    	processorCallBack.treat(data, false, writerCallback);
			    })
			    .on("end", function(){
			    	processorCallBack.treat(null, true, writerCallback);
			    });
			
			
			stream.pipe(csvStream);	
			
		}.bind(this));
	}.bind(this));
	
};

module.exports = FamilyReader;
