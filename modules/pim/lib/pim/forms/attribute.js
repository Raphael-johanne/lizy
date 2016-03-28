/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var Form 						= require("./form.js");
var forms 						= require('forms');
var fields 						= forms.fields;
var complementaryFieldsFunction = [];
var widgets 					= forms.widgets;
var util 						= require("util");

function AttributeForm() {
	Form.call(this);
}

util.inherits(AttributeForm, Form);

/**
 * complementary function to add field to form
 */
complementaryFieldsFunction['selectFields'] = function(data){
	
	var formFields = [];
	var modelOption = fields.object({
    	code   : fields.string({label: "Code"}),
    	value  : fields.string({label: "Value" })
     });
	
	if (typeof data !== 'undefined' && data !== null) {
		
		 var values = {name:'values', content:{}};
		 
		 var keys = Object.keys(data.values);
		 
		 keys.forEach(function(key, index){
			 values.content[key] = modelOption
		 });
		 formFields.push(values);
		 
	 } else {
		 formFields.push(
				 {
					 name    : "values",
					 content : {
				         0: modelOption
					 }
				 }
			); 
	 }
	return formFields;	
}

AttributeForm.prototype.getEdit = function(data, type) {

	 var formFields = {
		 code   : fields.string({required : true, label : "Code"}),
	     title  : fields.string({required : true, label : "Title"}),	
	     type  	: fields.string({required : true, widget: forms.widgets.hidden(), value : type}),
	 };

	 if (typeof complementaryFieldsFunction[type+"Fields"]  === 'function') {
		 complementaryFieldsFunction[type+"Fields"](data).forEach(function(item, index){
			 formFields[item.name] = item.content;
		 })
	 }
	 
	 var form = forms.create(formFields);
	 
	switch (type) {
		case 'select':
			var tpl = 'pim/page/forms/attribute/selectForm.ejs';
		break;
		case 'text':
		case 'textarea':
		case 'media':
			var tpl = 'pim/page/forms/attribute/textForm.ejs';
		break;
		default:{
			// @TODO BAD BAD BAD
		}
	}
	 
	 return Form.prototype.afterCreate.call(this, form, data, tpl);
};

module.exports = AttributeForm;
