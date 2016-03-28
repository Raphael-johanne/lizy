/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var Form 	= require("./form.js");
var forms 	= require('forms');
var fields 	= forms.fields;

var util 	= require("util");

function FamilyForm() {
	Form.call(this);
}

util.inherits(FamilyForm, Form);

FamilyForm.prototype.getEdit = function(data) {

	 var formFields = {
	     title  : fields.string({required : true, label : "Title"}),	
	 };

	 var form = forms.create(formFields);
	 
	 return Form.prototype.afterCreate.call(this, form, data, 'pim/page/forms/family/editForm.ejs');
};

FamilyForm.prototype.getCreate = function(data) {

	 var formFields = {
	     code  : fields.string({required : true, label : "Code"}),	
	 };

	 var form = forms.create(formFields);
	 
	 return Form.prototype.afterCreate.call(this, form, data, 'pim/page/forms/family/codeForm.ejs');
};

FamilyForm.prototype.formatEditData = function(data) {

	data.attributes.forEach(function(item, index){
		if (typeof item.required !== 'undefined') {
			item.required = 1;
		} else {
			item.required = 0;
		}
	});
	return data;
};


module.exports = FamilyForm;
