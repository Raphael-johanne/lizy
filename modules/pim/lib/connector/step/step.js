/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var events 	= require("events");
var util	= require("util");

function Step(config) 
{
	this.reader 	= null;
	this.processor 	= null;
	this.writer 	= null;
	this.code 		= null;
	
	this.init = function(config, jobExecution)
	{
		/*
		 * @TODO Fix : no more relative path
		 */
		var Reader  = require('../reader/' + config.connector.reader);
		this.reader = new Reader(config, jobExecution);
		
		if (typeof config.connector.processor !== 'undefined') {
			/*
			 * @TODO Fix : no more relative path
			 */
			var Processor  = require('../processor/'+ config.connector.processor);
			this.processor = new Processor(config, jobExecution);
		}
		
		if (typeof config.connector.writer !== 'undefined') {
			/*
			 * @TODO Fix : no more relative path
			 */
			var Writer  = require('../writer/' + config.connector.writer);
			this.writer = new Writer(config, jobExecution);
		}
	}
	
	this.lunch = function()
	{
		this.reader.treat(this.processor, this.writer);
	}
}

util.inherits(Step, events.EventEmitter);

module.exports = Step;