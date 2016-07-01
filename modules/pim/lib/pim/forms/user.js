/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var Form 		= require("./form.js");
var forms 		= require('forms');
var fields 		= forms.fields;
var widgets 	= require('forms').widgets;
var util 		= require("util");
var validators 	= forms.validators;

function CategoryForm() {
	Form.call(this);
}

util.inherits(CategoryForm, Form);

CategoryForm.prototype.getEdit = function(data) {

	 var form = forms.create({
		 username: fields.string(
				 { 
					 required: true, 
					 errorAfterField: true,
					 widget: widgets.text({ classes: ['control-label col-md-8'] }),
			         cssClasses: {
			            label: ['control-label col-md-4'],
			         }
		 	}
		 ),
	     email: fields.string(
	    		 { 
	    			 required: true,	 
	    			 errorAfterField: true,
	    			 widget: widgets.text({ classes: ['control-label col-md-8'] }),
	    		     cssClasses: {
	    		        label: ['control-label col-md-4']
	    		     }
	    		 }
	    ),
	    password: fields.password(
	    		{ 
	    			required: validators.required('You definitely want a password'), 
	    			cssClasses: {
			            label: ['control-label col-md-4'],
			         }
	    		}
	    	),
	    confirm:  fields.password(
	    		{
	    			required: validators.required('don\'t you know your own password?'),
	    			validators: [validators.matchField('password')],
	    			cssClasses: {
			            label: ['control-label col-md-4'],
			         }
	    		}
	    	),
	  });
	
	 return Form.prototype.afterCreate.call(this, form, data);
};

module.exports = CategoryForm;