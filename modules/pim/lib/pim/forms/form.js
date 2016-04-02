/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var events 		= require("events");
var util 		= require("util");
var widgets 	= require('forms').widgets;
var fieldsToAdd = [];
var forms 		= require('forms');
var fields 		= forms.fields;

function Form() {}

util.inherits(Form, events.EventEmitter);

Form.prototype.getHtml = function(form) {
	return form.toHTML(bootstrapField);
};

Form.prototype.afterCreate = function(form, data, template) {
	if (typeof data !== 'undefined' && data !== null) {
		 form = form.bind(data);
	}
	
	form.template = template;
	return form;
};

/**
 * add field to current form instance
 */
Form.prototype.addField = function(option) {
	fieldsToAdd.push(option);
};

/**
 * get fields to current form instance
 */
Form.prototype.getFields = function() {
	
	var data = {};
	fieldsToAdd.forEach(function(item, index){
		var field = {required : item.required, label : item.label};
		switch (item.type) {
			case 'select':
				field.widget  = widgets.select();
				field.choices = item.values;
				break;
			case 'textarea':
				field.widget  = widgets.textarea();
				break;
			case 'media':
				field.widget  = widgets.textarea();
				break;
		}
		
		data[item.code] = fields.string(field);
	});
	
	return data;
};

/** 
 * get bootstrap form
 */
var bootstrapField = function (name, object) {
	
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }
    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="alert alert-error help-block">' + object.error + '</div>' : '';

    var validationclass = object.error ? 'has-error' : validationclass;

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group ' + validationclass + '">' + label + widget + error + '</div>';
};

module.exports = Form;
