/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var Form 	= require("./form.js");
var forms 	= require('forms');
var fields 	= forms.fields;
var widgets = require('forms').widgets;
var util 	= require("util");

function ChannelForm() {
	Form.call(this);
}

util.inherits(ChannelForm, Form);

ChannelForm.prototype.getEdit = function(data) {

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
	     name: fields.string(
	    		 { 
	    			 required: true,	 
	    			 errorAfterField: true,
	    			 widget: widgets.text({ classes: ['control-label col-md-8'] }),
	    		     cssClasses: {
	    		        label: ['control-label col-md-4']
	    		     }
	    		 }
	    ),
	    status: fields.string(
	    		 { 
	    			 choices: {
	    		            0: '-- select a status --',
	    		            1: 'Enable',
	    		            2: 'Disable'
	    		     },
	    		     widget: widgets.select({ classes: ['control-label col-md-8'] }),
	    			 required: true,	 
	    			 errorAfterField: true,
	    		     cssClasses: {
	    		        label: ['control-label col-md-4']
	    		     }
	    		 }
	    ),
	  });
	 
	 return Form.prototype.afterCreate.call(this, form, data, 'pim/page/forms/channel/editForm.ejs');
};

module.exports = ChannelForm;