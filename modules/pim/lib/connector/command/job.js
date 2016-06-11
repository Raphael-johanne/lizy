/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var mongoose 		= require('mongoose');
require('../../pim/models/job');
var Item     		= mongoose.model('job');
var JobExecution 	= require('../service/jobExecution');
var Step = require('../step/step');

/**
 * @TODO do not use model declaration here, temporary test
 */
require('../../pim/models/product');
require('../../pim/models/family');
require('../../pim/models/attribute');
require('../../pim/models/category');

function jobCommand(parameters) {
	
	this.code = parameters.code;
}

/**
 * execute an import or export job profile with command line, depends on code given
 */
jobCommand.prototype.execute = function() {
	
	var jobExecution  = new JobExecution();
	  
	jobExecution.on('job_execution_report', function(notifications) {
		console.log(JSON.stringify(notifications));
	});
	
	Item.findOne({'code':this.code}, {}, function(err, doc) {
		if (err) {
			console.log(err);
		} else {
			var step = new Step();
			  
			step.init(doc.config, jobExecution);
		 	step.lunch();
		}
	});
}

module.exports = jobCommand;