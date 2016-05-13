/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var events 	= require("events");
var util 	= require("util");
var Writer 	= require("../writer.js");
var mongoose 			= require('mongoose');

function MongoWriter(config, jobExecution) {
	
	Writer.call(this, config, jobExecution);
	
	if (typeof this.config.collection !== 'undefined'
		&& typeof this.config.key !== 'undefined') {
		
		this.model	= mongoose.model(this.config.collection);
	} else {
		this.model    = null;
	}
}

util.inherits(MongoWriter, Writer);

MongoWriter.prototype.treat = function(item, last) {
	
	if (typeof item._id !== 'undefined') {
		item.save( function ( err, item, count ){
			if (err) {
				this.jobExecution.addError(err, item.sku);
			} else {
				this.jobExecution.addUpdateEntry();
			}
			
 	      }.bind(this));
	} else {
		new this.model(item).save(function( err, item, count ){
			if (err) {
				this.jobExecution.addError(err, item.sku);
			} else {
				this.jobExecution.addCreateEntry();
			}
    	  }.bind(this));
	}
};

module.exports = MongoWriter;
