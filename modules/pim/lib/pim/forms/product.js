/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var Form 	= require("./form.js");
var forms 	= require('forms');
var fields 	= forms.fields;
var widgets = forms.widgets;
var util 	= require("util");

function ProductForm() {
	Form.call(this);
}

util.inherits(ProductForm, Form);

ProductForm.prototype.getEdit = function(data) {

	var form = forms.create(Form.prototype.getFields.call(this));	 
	return Form.prototype.afterCreate.call(this, form, data, 'pim/page/forms/product/editForm.ejs');
};

ProductForm.prototype.getCreate = function(data) {

	 var formFields = {
	     sku    : fields.string({required : true, label : "Sku"}),
	     family : fields.string({required : true }),
	 };

	 var form = forms.create(formFields);
	 
	 return Form.prototype.afterCreate.call(this, form, data, 'pim/page/forms/product/codeForm.ejs');
};

module.exports = ProductForm;