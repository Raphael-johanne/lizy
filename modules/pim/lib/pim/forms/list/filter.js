/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var Form 	= require("../form.js");
var forms 	= require('forms');
var fields 	= forms.fields;
var widgets = require('forms').widgets;
var util 		= require("util");

function FilterForm() {
	Form.call(this);
}

util.inherits(FilterForm, Form);

FilterForm.prototype.getFilters = function(data, fieldsFilter) {
	
	 var formFields = {};

	 var keys = Object.keys(fieldsFilter);
	 
	 keys.forEach(function(fieldFilter, index) {
		 formFields[fieldFilter] = fields.string({ 
			 label : fieldsFilter[fieldFilter]
		 })
	 });
	 
	 var form = forms.create(formFields);
	 
	 return Form.prototype.afterCreate.call(this, form, data);
};

module.exports = FilterForm;