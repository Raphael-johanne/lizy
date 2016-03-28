/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var Form 	= require("./form.js");
var forms 	= require('forms');
var fields 	= forms.fields;
var widgets = forms.widgets;
var util 	= require("util");

function JobForm() {
	Form.call(this);
}

util.inherits(JobForm, Form);

JobForm.prototype.getEdit = function(data) {

	var formFields = {
		name  : fields.string({required : true, label : "Name"}),
		code  : fields.string({required : true, label : "Code"}),
		config : {}
	};
	
	Object.keys(data.config).forEach(function(item, index){

		if (typeof data.config[item] === 'object') {
			Object.keys(data.config[item]).forEach(function(field, index){
				
				if (typeof formFields.config[item] === 'undefined') {
					formFields.config[item] = {};
				}
				
				formFields.config[item][field] = fields.string({required : true, label : field });
			});
		} else if (typeof data.config[item] === 'string') {
			formFields.config[item] = fields.string({required : true, value : data.config[item]});
		}
	})
	
	var form = forms.create(formFields);

	return Form.prototype.afterCreate.call(this, form, data, 'pim/page/forms/job/editForm.ejs');
	 
};

JobForm.prototype.getCreate = function(data) {

	 var formFields = {
	     code   : fields.string({required : true, label : "Code"}),
	     type   : fields.string({required : true , widget : widgets.select(), choices : {import : "Import", export: "Export"}}),
	 };

	 var form = forms.create(formFields);
	 
	 return Form.prototype.afterCreate.call(this, form, data, 'pim/page/forms/job/codeForm.ejs');
};

module.exports = JobForm;
