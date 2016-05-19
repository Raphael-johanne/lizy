/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

/**
 * file executor to execute in the command line position
 */
var COMMAND_EXECUTOR_POSITION		= 2; 
var DEFAULT_COMMAND_DELIMITER		= ":";
var DEFAULT_PARAMETER_DELIMITER     = "=";

//database connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/lizy');

/**
 * add console fonctionnality to the pim
 * 
 * Example :
 * 
 * nodejs console.js connector:job code=import_product_csv
 * 
 * ----------------- moduleName:commandFileName paramField1=paramValue1 ...
 */
function Console(){
	
	this.parameters = this.formatParameters(process.argv);
}

/**
 * Execute the process
 */
Console.prototype.execute = function() {
	
	if (typeof this.parameters.module == "undefined") {
		console.log('Module is not correct');
	} else if (typeof this.parameters.command == "undefined") {
		console.log('Command is not correct');
	} else {
		
		var Command = require(__dirname + '/modules/pim/lib/' + this.parameters.module + '/command/' + this.parameters.command);
		var command = new Command(this.parameters);
		command.execute();
	}
}

/**
 * format parameters to have a clean object of params
 */
Console.prototype.formatParameters = function(parameters) {
	var sanitizedParameters = {};
	parameters.forEach(function(item, index){
		if (index == COMMAND_EXECUTOR_POSITION) {
			var parameterInfo = item.split(DEFAULT_COMMAND_DELIMITER);
			sanitizedParameters.module  = parameterInfo[0]; 
			sanitizedParameters.command = parameterInfo[1];
		} else if (index > COMMAND_EXECUTOR_POSITION){
			var parameterInfo = item.split(DEFAULT_PARAMETER_DELIMITER);
			sanitizedParameters[parameterInfo[0]] = parameterInfo[1]; 
		}
	});
	
	return sanitizedParameters;
}

var Console = new Console();
Console.execute();
