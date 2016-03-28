/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var Form 	= require("./form.js");
var forms 	= require('forms');
var fields 	= forms.fields;
var widgets = require('forms').widgets;
var util 	= require("util");

function CategoryForm() {
	Form.call(this);
}

util.inherits(CategoryForm, Form);

CategoryForm.prototype.getEdit = function(data) {

	 var form = forms.create({
		 code: fields.string(
				 { 
					 required: true, 
					 errorAfterField: true,
					 widget: widgets.text({ classes: ['control-label col-md-8'] }),
			         cssClasses: {
			            label: ['control-label col-md-4'],
			         }
		 	}
		 ),
	     title: fields.string(
	    		 { 
	    			 required: true,	 
	    			 errorAfterField: true,
	    			 widget: widgets.text({ classes: ['control-label col-md-8'] }),
	    		     cssClasses: {
	    		        label: ['control-label col-md-4']
	    		     }
	    		 }
	    ),
	  });
	
	 return Form.prototype.afterCreate.call(this, form, data);
};

module.exports = CategoryForm;