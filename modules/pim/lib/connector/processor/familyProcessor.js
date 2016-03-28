 /*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var Processor 	= require("./processor.js");
var events 		= require("events");
var util 		= require("util");
var mongoose 	= require('mongoose');

function FamilyProcessor(config) {
	
	/**
	 * @see parent Processor
	 */
	Processor.call(this, config);
	
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

FamilyProcessor.prototype.treat = function(item, last, writerCallback) {
	if (last === false) {
		if(this.row === 0) {
			
			this.familyCode 	= item.family_code;
			this.familyTitle 	= item.family_title;
		} else {
			this.attributes.push({code:item.attribute, required:item.required});
		}
		//console.log(this.row);
		//console.log(item);
		this.row++;
		
	}else {
		console.log('LAST ' +this.row);
		this.row = 0;
		var nbrAttributes = this.attributes.length-1;
	
		this.attributes.forEach(function(attribute, index){
			
			this.attributeModel.findOne({code:attribute.code}, "_id",function(err, doc){
				
				if (doc === null || typeof doc === 'undefined') {
					nbrAttributes--;
					console.log('attributes ['+attribute.code+'] does not exist');
					return;
				}
				
				this.familyAttributes.push({_id:doc._id, required:attribute.required});
				
				/**
				 * all attributes are loaded, we can write the family
				 */
				if (nbrAttributes == index) {
					var assignAttributes = function(familyCode, familyTitle, familyAttributes){
						
						Processor.prototype.treat.call(this, {code:familyCode}, last, function(doc, last){
												
							doc.title 		= familyTitle;
							doc.attributes 	= familyAttributes;
							
							writerCallback.treat(doc, last);
							
						});
					}.bind(this);
					
					assignAttributes(this.familyCode, this.familyTitle, this.familyAttributes);
				}
				
			}.bind(this))
		}.bind(this));
	}
};

module.exports = FamilyProcessor;