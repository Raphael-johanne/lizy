 /*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var Processor 	= require("./processor.js");
var events 		= require("events");
var util 		= require("util");
var mongoose 	= require('mongoose');
var moment 			= require('moment');
var merge 			= require('merge');
/*
 * @TODO Fix : no more relative path
 */
var coreGlobal 		= require('../../../core/services/config.js');
function FamilyProcessor(config, jobExecution) {
	
	/**
	 * @see parent Processor
	 */
	Processor.call(this, config, jobExecution);
	
	/**
	 * @var attributes array will contains all attributes of the family with code and requirement condition
	 */
	this.attributes 		=  [];
	this.row 				= 0;
	this.familyCode 		= null;
	this.familyTitle 		= null;
	this.attributeModel 	= mongoose.model('attribute');
	this.familyAttributes 	= [];
}

util.inherits(FamilyProcessor, Processor);

FamilyProcessor.prototype.treat = function(item, last, callback) {
	
	if (last === false) {
		if (this.row === 0) {
			this.familyCode 	= item.family_code;
			this.familyTitle 	= item.family_title;
		} else {
			this.attributes.push({code:item.attribute, required:item.required});
		}
		this.row++;
	}else {
		this.row = 0;
		var nbrAttributes = this.attributes.length-1;
	
		this.attributes.forEach(function(attribute, index){
			
			this.attributeModel.findOne({code:attribute.code}, "_id", function(err, doc) {
				
				if (doc === null || typeof doc === 'undefined') {
					nbrAttributes--;
					return;
				}
				
				this.familyAttributes.push({_id:doc._id, required:attribute.required});
				
				/**
				 * all attributes are loaded, we can write the family
				 */
				if (nbrAttributes == index) {
					var assignAttributes = function(familyCode, familyTitle, familyAttributes){
						this.familyAttributes = [];
						this.model.findOne({code:familyCode}, {}, function(err, doc){

							if (doc !== null) {
								item = merge(doc, item);
								item.attributes = familyAttributes;
							} else {
								item = {
									code:familyCode,
									title:familyTitle,
									attributes:familyAttributes
								};
							}

							item.mdate = moment().format(coreGlobal.getDefaultDateFormat());
							
							callback.treat(item, false);
						})
					}.bind(this);
					assignAttributes(this.familyCode, this.familyTitle, this.familyAttributes);
				}
			}.bind(this))
		}.bind(this));
	}
};

module.exports = FamilyProcessor;