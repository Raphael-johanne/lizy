/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var Controller 	= require("./controller.js");
var mongoose 	= require('mongoose');
var forms 		= require('../forms/family');
var List 		= require('../services/list');
require('../models/family');
var util 		= require("util");
var Item     	= mongoose.model('family');
var Attribute   = mongoose.model('attribute');
var merge 		= require('merge');

function FamilyController() {
	Controller.call(this);
}

util.inherits(FamilyController, Controller);

FamilyController.controller = function(app, entity) {

  /**
  * List route
  */
  app.get('/'+entity+'/list/:p?/:limit?', Controller.prototype.isAuthenticated, function(req, res) {
	  var list = new List();
	  
	  Controller.prototype.addFileToHead('list/family/list.js', 'js');
	  
	  list.getList(Item, entity, {'code':'Code', 'title':'Title'}, {'code':'Code', 'title':'Title'}, req, function(err, docs, fields, filtersFormHtml, paginationHtml) {
		  
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
    * Create family, only code is required
    */
    app.get('/'+entity+'/create', function(req, res) {
    	var formInstance = new forms();
   	  	var form = formInstance.getCreate();

   	  	Controller.prototype.renderPopin(res, form.template, {
 	    	  'form' : form,
 	    	  'action' : '/'+entity+'/save'
 	    	  }
 	      );
    });
  
  /**
  * Edit family route
  */
  app.get('/'+entity+'/edit/:id', Controller.prototype.isAuthenticated, function(req, res) {
	
	  var id = req.params.id;
	  
	  Controller.prototype.addFileToHead('forms/family/form.js', 'js');
	  
	  Controller.prototype.once('attributes_loaded', function(attributes, form) {
    	  Controller.prototype.render(res, form.template, {
	    	  'form'	: form,
	    	  'action'	: '/'+entity+'/update/'+ id,
	    	  'attributes': attributes
	    	  }
	      );
    	  }
      );
	  
	  Item.findById(id, function(err, doc) {
		  if (err) return res.status(404).render('pim/page/404.ejs');
		 
		  var formInstance = new forms();
		  var form = formInstance.getEdit(doc);
		  
		  var countAttributes = (typeof doc.attributes.length === 'undefined')? 0 : doc.attributes.length ;
		  var attributes = [];
		  if (countAttributes > 0) {
			  var i = 0;
			  doc.attributes.forEach(function(item, index){
				  Attribute.findById(item._id, function(err, doc) {
					  attributes.push({_id : doc._id, title:doc.title, required : item.required});
					  i++;
					  
					  if (i == countAttributes){
						  Controller.prototype.emit('attributes_loaded', attributes, form);
					  }
				  });
			  })
			  
		  } else {
			  Controller.prototype.emit('attributes_loaded', null, form);
		  }
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
 		     
 		      res.redirect( '/'+entity+'/list' );
 		    });
 		});
   });
  
  /**
  * Save route
  */
  app.post('/'+entity+'/save', Controller.prototype.isAuthenticated, function(req, res) {
 	 
	  var formInstance = new forms();
	  var form = formInstance.getCreate();
	   
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
 	        		  doc = merge(doc, req.body);
 	        		  
 	        		  doc = formInstance.formatEditData(doc);
 	        		  
 	        		  doc.mdate = Date.now();
 	        		  
 	        		  doc.save( function ( err, item, count ){
 	        			res.redirect('/'+ entity +'/edit/' + item._id);
 	        	      });
 	      		});
 	        },
 	        error: function (form) {
 	        	Controller.prototype.render(res, 'pim/page/form.ejs', {
 		  	    	  'form'	: form,
 		  	    	  'action'	: '/'+entity+'/save'
 		  	    	  }
 	        
 	  	      );
 	        },
 	        empty: function (form) {
 	        	return res.status(404).render('pim/page/404.ejs');
 	        }
 	    });
    });
   
   /**
    * Get attributes in JSON for family add attribute fonctionnality
    */
    app.get('/'+entity+'/product/families', Controller.prototype.isAuthenticated, function(req, res) {
  	
  	  	var startWith = req.query.name_startsWith;
  	  	
  	  	var conditions = { 'code': new RegExp(startWith, 'i') }; 
  	  		  
	  	Item.find(conditions, "_id code title", function(err, docs) {
	  		res.setHeader('Content-Type', 'application/json');
	  		return res.send(JSON.stringify(docs));
		});
    });   
}

module.exports = FamilyController;