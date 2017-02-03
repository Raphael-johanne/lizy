/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */
var Controller 			= require("./controller.js");
var mongoose 			= require('mongoose');
var forms 				= require('../forms/attribute');
var List 				= require('../services/list');
/*
 * @TODO Fix : no more relative path
 */
var attributeService 	= require('../../connector/service/attribute');
require('../models/attribute');
var util 				= require("util");
var Item     			= mongoose.model('attribute');
var merge 				= require('merge');

function AttributeController() {
	Controller.call(this);
}

util.inherits(AttributeController, Controller);

AttributeController.controller = function(app, entity) {

  /**
  * List route
  */
  app.get('/'+entity+'/list/:p?/:limit?', Controller.prototype.isAuthenticated,function(req, res) {
	  var list = new List();
	  
	  Controller.prototype.addFileToHead('list/attribute/list.js', 'js');
	  
	  list.getList(Item, entity, {'code':'Code', 'title':'Title', 'type':'Type'}, {'code':'Code', 'title':'Title', 'type':'Type'}, req, function(err, docs, fields, filtersFormHtml, paginationHtml) {
		  
		  if (err) return res.status(404).render('page/404.ejs');
		  
		  Controller.prototype.render(res, req, 'pim/page/list.ejs', {
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
   * Choice attribute type route
   */
   app.get('/'+entity+'/type/choices', Controller.prototype.isAuthenticated, function(req, res) {
	   
	   var choices = attributeService.getAttributeTypeCodes();
	   Controller.prototype.renderPopin(res, 'pim/page/attribute/choice.ejs', {
	    	  'choices'		: choices
	    	  }
	      );
   });
  
  /**
   * List route
   */
   app.post('/'+entity+'/list', Controller.prototype.isAuthenticated, function(req, res) {
	   req.session[entity + '_filters_list'] = req.body;
	   res.redirect('/'+entity+'/list');
   });

  /**
   * Create route
   */
   app.get('/'+entity+'/create/:type', Controller.prototype.isAuthenticated, function(req, res) {
	  
	   var type = req.params.type;
	   
	   if (attributeService.getAttributeTypeCodes().indexOf(type) === -1) {
		   return res.status(404).render('pim/page/404.ejs');
	   }

	   Controller.prototype.addFileToHead('forms/attribute/form.js', 'js');
	   
	   var formInstance = new forms();
	   var form = formInstance.getEdit(null, type);

	   Controller.prototype.render(res, req, form.template, {
    	  'form'	: form,
    	  'action'	: '/'+entity+'/save'
    	  }
       );
   });  
  
  /**
  * Edit route
  */
  app.get('/'+entity+'/edit/:id', Controller.prototype.isAuthenticated, function(req, res) {
	
	  var id 	= req.params.id;
	  
	  Controller.prototype.addFileToHead('forms/attribute/form.js', 'js');
	  
	  Item.findById(id, function(err, doc) {
		  if (err) return res.status(404).render('pim/page/404.ejs');

		  var formInstance = new forms();
		  var form = formInstance.getEdit(doc, doc.type);
		  Controller.prototype.render(res, req, form.template, {
	    	  'form'	: form,
	    	  'action'	: '/'+entity+'/update/'+ id
	    	  }
	      );
		});
  });
  
  /**
   * Remove route
   */
   app.get('/'+entity+'/remove/:id', Controller.prototype.isAuthenticated, function(req, res) {
 	
 	  var id 	= req.params.id;
 	  
 	  Item.findById(id, function(err, doc) {
 		  if (err) return res.status(404).render('pim/page/404.ejs');
 		 
 		 doc.remove(function (err, doc ){
 		      if (err) return next( err );
 		     
                req.session.message = {type:'success', message: 'The attribute has been succesfully removed'};

 		      res.redirect( '/'+entity+'/list' );
 		    });
 		});
   });
  
   /**
    * Get attributes in JSON for family add attribute fonctionnality
    */
    app.get('/'+entity+'/family/attributes', Controller.prototype.isAuthenticated, function(req, res) {
  	
    	
  	  	var alreadyUsedAttributeIds 	= req.params.already_used_attribute_ids;
  	  	var startWith = req.query.name_startsWith;
  	  	
  	  	var conditions = { 'code': new RegExp(startWith, 'i') }; 
  	  	
  	  	if (typeof alreadyUsedAttributeIds !== 'undefined') {
  	  		//conditions._id : {"$not":alreadyUsedAttributeIds}}; 
  	  	}
  	  
	  	Item.find(conditions, "_id code title", function(err, docs) {
	  		res.setHeader('Content-Type', 'application/json');
	  		return res.send(JSON.stringify(docs));
		});
  		
    });
   
  /**
  * Save route
  */
  app.post('/'+entity+'/save', Controller.prototype.isAuthenticated, function(req, res) {
 	 
	  var type = req.body.type;
	   
	   if (attributeService.getAttributeTypeCodes().indexOf(type) === -1) {
		   return res.status(404).render('pim/page/404.ejs');
	   }
	  
	   var formInstance = new forms();
	   var form = formInstance.getEdit(null, type);
	   
	   form.handle(req, {
	        success: function (form) {
	      	req.session.message = {type:'success', message: 'The attribute has been succesfully created'};
	    		new Item(req.body).save( function( err, item, count ){
	        	    res.redirect('/'+ entity +'/edit/' + item._id);
	        	  });
	        },
	        error: function (form) {
                req.session.message = {type:'danger', message: 'An error append'};
	        	Controller.prototype.render(res, req, form.template, {
	  	    	  'form'	: form,
	  	    	  'action'	: '/'+entity+'/create/' + type
	  	    	  }
	  	      );
	        },
	        empty: function (form) {
                req.session.message = {type:'danger', message: 'An error append'};
	        	return res.status(404).render('pim/page/404.ejs');
	        }
	    });
   });
  
  /**
   * Update route
   */
   app.post('/'+entity+'/update/:id', Controller.prototype.isAuthenticated, function(req, res) {
  	 
	   var type = req.body.type;
	   
	   if (attributeService.getAttributeTypeCodes().indexOf(type) === -1) {
		   return res.status(404).render('pim/page/404.ejs');
	   }
	   
	   var formInstance = new forms();
	   var form = formInstance.getEdit(null, type);
 	   var id 	= req.params.id;
	  
 	   form.handle(req, {
 	        success: function (form) {
 	        	  Item.findById(id, function(err, doc) {
 	        		  
 	        		  if (err) return res.status(404).render('pim/page/404.ejs');
 	        		  doc 		= merge(doc, req.body);
	        		  doc.mdate = Date.now();
 	        		  
                        req.session.message = {type:'success', message: 'The attribute has been succesfully updated'};

 	        		  doc.save( function ( err, item, count ){
 	        			res.redirect('/'+ entity +'/edit/' + item._id);
 	        	      });
 	        	      
 	      		});
 	        },
 	        error: function (form) {
 	        	Controller.prototype.render(res, req, 'pim/page/form.ejs', {
 	  	    	  'form'	: formInstance.getHtml(form),
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

module.exports = AttributeController;
