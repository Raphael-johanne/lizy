/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */
require('../models/product');
/*
 * @TODO Fix : no more relative path
 */
var Controller 		= require("./controller.js");
var mongoose 		= require('mongoose');
var forms 			= require('../forms/product');
var List 			= require('../services/list');
var util 			= require("util");
var Item     		= mongoose.model('product');
var Family     		= mongoose.model('family');
var Attribute  		= mongoose.model('attribute');
var merge 			= require('merge');
var mediaService 	= require('../../connector/service/media.js');

function ProductController() {
	Controller.call(this);
}

util.inherits(ProductController, Controller);

ProductController.controller = function(app, entity) {

  /**
  * List route
  */
  app.get('/'+entity+'/list/:p?/:limit?', Controller.prototype.isAuthenticated, function(req, res) {
	  var list = new List();
	  
	  Controller.prototype.addFileToHead('list/product/list.js', 'js');
	  
	  list.getList(Item, entity, {'sku':'Code', 'normalizedData.title':'Title'}, {'sku':'Code', 'normalizedData.title':'Title'}, 
			  req, 
			  function(err, docs, fields, filtersFormHtml, paginationHtml) {
		  		
		  
				  if (err) return res.status(404).render('page/404.ejs');
				  
					  Controller.prototype.render(res, 'pim/page/list.ejs', {
				    	  'items'		: docs,
				    	  'entity'  	: entity,
				    	  'fields'  	: fields,
				    	  'filters' 	: filtersFormHtml,
				    	  'pagination' 	: paginationHtml
				    	  }
				      );
	  			});
  });

  /**
   * List route
   */
   app.post('/'+entity+'/list', Controller.prototype.isAuthenticated, function(req, res) {
	   req.session[entity + '_filters_list'] = req.body;
	   res.redirect('/'+entity+'/list');
   });
  
   /**
    * Create product, only code and family is required
    */
    app.get('/'+entity+'/create', Controller.prototype.isAuthenticated, function(req, res) {
    	var formInstance = new forms();
   	  	var form = formInstance.getCreate();
   	  	
   	  	Controller.prototype.addFileToHead('forms/product/form.js', 'js');
   	  	
   	  	Controller.prototype.renderPopin(res, form.template, {
 	    	  'form' : form,
 	    	  'action' : '/'+entity+'/save'
 	    	  }
 	      );
    });
  
  /**
  * Edit product route
  */
  app.get('/'+entity+'/edit/:id', Controller.prototype.isAuthenticated, function(req, res) {
	
	  var id = req.params.id;
	  
	  Controller.prototype.addFileToHead('forms/product/form.js', 'js');
	  Controller.prototype.addFileToHead('jquery/upload/js/jquery.iframe-transport.js', 'js');
	  Controller.prototype.addFileToHead('jquery/upload/js/jquery.fileupload.js', 'js');
	  
	  var formInstance = new forms();
	  
	  Controller.prototype.once('attributes_loaded', function(doc) {
		  var form = formInstance.getEdit(doc.normalizedData);
		  Controller.prototype.render(res, form.template, {
	    	  'form'	: form.toHTML(),
	    	  'action'	: '/'+entity+'/update/'+ id,
	    	  }
	      );
	  });
	  
	  Item.findById(id, function(err, doc) {
		  if (err) return res.status(404).render('pim/page/404.ejs');
		  
		  /**
		   * looking for the family of the current product
		   */
		  Family.findById(doc.family, function(err, family) {
			  if (err) return res.status(404).render('pim/page/404.ejs');
			  
			  var countAttributes = (typeof family.attributes.length === 'undefined')? 0 : family.attributes.length ;
			  
			  /**
			   * load attributes forms fields
			   */
			  if (countAttributes > 0) {
				  var i = 0;
				  family.attributes.forEach(function(attribute, index){
					  Attribute.findById(attribute._id, function(err, attributeDoc) {
						  var field = {
								  "code"     : attributeDoc.code, 
								  "required" : false,
								  "label"    : attributeDoc.title,
								  "type"	 : attributeDoc.type
							  };
						  
						  if (typeof attributeDoc.values !== 'undefined' && attributeDoc.values.length > 0) {
							  field.values = {};
							  attributeDoc.values.forEach(function(value, index) {
								  field.values[value.code] = value.value;
							  });
						  }
						  
						  formInstance.addField(field);
						  i++;
						  
						  if (i == countAttributes){
							  Controller.prototype.emit('attributes_loaded', doc);
						  }
					  });
				  });
			  }
		  });
		});
  });
  
  /**
   * Remove route
   */
   app.get('/'+entity+'/remove/:id', Controller.prototype.isAuthenticated, function(req, res) {
 	
 	  var id 	= req.params.id;
 	  
 	  Item.findById(id, function(err, doc) {
 		  if (err) return res.status(404).render('pim/page/404.ejs');
 		 
 		  var sku = doc.sku;
 		  
 		 doc.remove(function (err, doc ){
 		      if (err) return next( err );
 		     
 		      res.redirect( '/'+entity+'/list' );
 		      
 		      // remove media of product
 		      mediaService.removeMediaBySku(sku);
 		    });
 		});
   });
  
  /**
  * Save route
  */
  app.post('/'+entity+'/save', Controller.prototype.isAuthenticated, function(req, res) {
 	 
	  var formInstance  = new forms();
	  var form 			= formInstance.getCreate();
	   
	   form.handle(req, {
	        success: function (form) {
	        		new Item(form.data).save( function( err, item, count ){
		        	    res.redirect('/'+ entity +'/edit/' + item._id);
		        	  });
	        	},
	        error: function (form) {
	        	return res.redirect('/'+ entity +'/list');
	        },
	        empty: function (form) {
	        	return res.status(404).render('pim/page/404.ejs');
	        }
	    });
   });
  
  /**
   * Save route
   */
   app.post('/'+entity+'/update/:id', Controller.prototype.isAuthenticated, function(req, res) {
  	 
	   var formInstance = new forms();
	   var form = formInstance.getEdit();
 	   var id 	= req.params.id;
	  
 	   form.handle(req, {
 	        success: function (form) {
 	        	  Item.findById(id, function(err, doc) {
 	        		  if (err) return res.status(404).render('pim/page/404.ejs');
 	        		  doc.normalizedData = req.body;
 	        		
 	        		  doc.mdate = Date.now();
 	        		  
 	        		  doc.save( function ( err, item, count ){
 	        			res.redirect('/'+ entity +'/edit/' + item._id);
 	        	      });
 	      		});
 	        },
 	        error: function (form) {
 	        	
 	        	Controller.prototype.render(res, 'pim/page/form.ejs', {
 		  	    	  'form'	: form.toHTML(),
 		  	    	  'action'	: '/'+entity+'/save'
 		  	    	  }
 	  	      );
 	        },
 	        empty: function (form) {
 	        	return res.status(404).render('pim/page/404.ejs');
 	        }
 	    });
    });
}

module.exports = ProductController;