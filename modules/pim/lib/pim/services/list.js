/**!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */
var events 			= require("events");
var util 			= require("util");
var forms 			= require('../forms/list/filter');
var format 			= require('../../core/services/format');
var widgets 		= require('forms').widgets;
var paginate 		= require('express-paginate');

function List() {}

util.inherits(List, events.EventEmitter);

/**
 * get list items and filters by model, entity and fields to select
 */
List.prototype.getList = function(model, entity, fields, fieldsToFilter, req, callback) {
	
	List.getFilters(req, entity, fieldsToFilter, function(err, filtersFormHtml, filters){
		var conditions 	= List.getConditionsByFilters(filters);
	
		List.getPagination(model, req, conditions, entity, function(err, paginationHtml, page, limit){
			model.find(conditions, fields, function(err, docs) {
				docs = List.getFormatedDocs(docs);
				callback(err, docs, fields, filtersFormHtml, paginationHtml);
			}).skip(limit * (page - 1)).limit(limit); 
		})
	})
};

/**
 * get formated docs
 */
List.getFormatedDocs = function (docs) {
	var formatedDocs 	= [];
	var docIndex		= 0;
	var Format 			= new format();
	docs.forEach(function(doc, index) {
		formatedDocs[docIndex] = Format.objectToUnderscore(doc._doc);
		formatedDocs[docIndex]._id = doc._id;
		docIndex++;
	});

	return formatedDocs;
}

/**
 * get filters for current list
 */
List.getPagination = function(model, req, conditions, entity, callback) {
	
	var limit	= (req.params.limit)	? req.params.limit :10;
	var page	= (req.params.p)		? req.params.p     :1;
	
	model.find(conditions, '_id').count(function(err, count) {
		
		app.render(
				'pim/page/list/pagination.ejs', 
				{
			  	  'nbrItem'	 	: count,
			  	  'nbrPage'  	: Math.ceil(count/limit),
			  	  'limit'		: 10,
			  	  'currentPage' : page,
			  	  'basePath' 	: '/' + entity + '/list' 	
			  	}, 
		  	  function (err, html) {
		  		callback(null, html, page, limit);
		  	  }
	    );
	}); 
};

/**
 * get filters for current list
 */
List.getFilters = function(req, entity, fields, callback) {
	
	var filters = req.session[entity + '_filters_list'];
	var form 	= new forms();
	var filtersForm = form.getFilters(filters, fields);
	
	app.render(
			'pim/page/form.ejs', 
			{
		  	  'form'	: form.getHtml(filtersForm),
		  	  'action'	: '/'+entity+'/list'
		  	}, 
	  	  function (err, html) {
	  		callback(null, html, filters);
	  	  }
    );
};

/**
 * get formated conditions by filter to use for mongo query
 */
List.getConditionsByFilters = function(filters) {
	 var conditions = {};
	 
	 if (typeof filters === 'undefined') {
		 return conditions;
	 }
	 
	 var keys = Object.keys(filters);
	 
	 keys.forEach(function(field, index) {
		 
		 if (filters[field]) {
			 conditions[field] = new RegExp(filters[field], 'i');
		 }
	 });
	 
	 return conditions;
}

module.exports = List;
