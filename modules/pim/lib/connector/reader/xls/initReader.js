/*!
 * Copyright(c) Raphael Colboc 
 * MIT Licensed
 */

require('../../../pim/models/category');
var Reader 		= require("../reader.js");
var util 		= require("util");
var mongoose 	= require('mongoose');
var xlsx 		= require('node-xlsx');
var appRoot 	= require('app-root-path');
var CategoryProcessor 		= require("../../processor/categoryProcessor.js");
function InitReader(config) {
	Reader.call(this, config);
}

util.inherits(InitReader, Reader);

var reader = new InitReader();

InitReader.prototype.treat = function(processorCallBack, writerCallback) {
	var attributes 		= [];
	var options 		= [];
	var categories 		= [];
	var attributesTypes = [];
	
	var sheets = xlsx.parse(appRoot + '/modules/pim/import/20160304_04_init_all.xlsx');
	
	sheets.forEach(function(sheet, index) {
		
		if (sheet.name == 'attributes') {
			attributes  = InitReader.prototype.formatSheetData(sheet, 5);
			//console.log(attributes);
		}
		
		if (sheet.name == 'options') {
			options  = InitReader.prototype.formatSheetData(sheet, 2);
			//console.log(options);
		}
		
		if (sheet.name == 'categories_MarketPlace') {
			categories  = InitReader.prototype.formatSheetData(sheet, 2);
			//console.log(categories);
		}
		
		if (sheet.name == 'attribute_types') {
			attributesTypes  = InitReader.prototype.formatSheetData(sheet, 0);
			//console.log(attributesTypes);
		}
	});
	/*
	attributes.forEach(function(attribute, index){
		
	});
	*/
	
	categories.forEach(function(category, index){
		category.title = category['label-fr_FR'];
		CategoryProcessor.prototype.treat(category);
	});
	//processorCallBack.treat(item, last, writerCallback);
};

InitReader.prototype.formatSheetData = function(sheet, colNameIndex){
	var itemCols 	= [];
	var items 		= [];
	sheet.data.forEach(function(item, index){
		if (index == colNameIndex){
			itemCols = item;
		} else if(index > colNameIndex) {
			var entity = {};
			for (var i = 0; i < itemCols.length; i++) {
				entity[itemCols[i]] = item[i];	
			}
			items.push(entity);
		}
	});
	return items;
};

module.exports = InitReader;
