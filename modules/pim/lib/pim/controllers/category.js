/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var Controller 	= require("./controller.js");
var mongoose 	= require('mongoose');
var forms 		= require('../forms/category');
var List 		= require('../services/list');
require('../models/category');
var util 		= require("util");
var Item     	= mongoose.model('category');
var merge 		= require('merge');

function CategoryController() {
	Controller.call(this);
}

util.inherits(CategoryController, Controller);

CategoryController.controller = function(app, entity) {

  /**
  * List route
  */
  app.get('/'+entity+'/list/:p?/:limit?', function(req, res) {
	  var list = new List();
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
   app.post('/'+entity+'/list', function(req, res) {
	   req.session[entity + '_filters_list'] = req.body;
	   res.redirect('/'+entity+'/list');
   });

  /**
   * Create route
   */
   app.get('/'+entity+'/create', function(req, res) {
	  
	  var formInstance = new forms();
	  var form = formInstance.getEdit();
	  
	  Controller.prototype.render(res, 'pim/page/form.ejs', {
    	  'form'	: formInstance.getHtml(form),
    	  'action'	: '/'+entity+'/save'
    	  });
   });  
  
  /**
  * Edit route
  */
  app.get('/'+entity+'/edit/:id', function(req, res) {
	
	  var id = req.params.id;
	  
	  Item.findById(id, function(err, doc) {
		  if (err) return res.status(404).render('pim/page/404.ejs');
		 
		  var formInstance = new forms();
		  var form = formInstance.getEdit(doc);
		  
		  Controller.prototype.render(res, 'pim/page/form.ejs', {
	    	  'form'	: formInstance.getHtml(form),
	    	  'action'	: '/'+entity+'/update/'+ id
	    	  }
	      );
		});
  });
  
  /**
   * Remove route
   */
   app.get('/'+entity+'/remove/:id', function(req, res) {
 	
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
  app.post('/'+entity+'/save', function(req, res) {
 	 
	  var formInstance = new forms();
	  var form = formInstance.getEdit();
	   
	   form.handle(req, {
	        success: function (form) {
	        		new Item(form.data).save( function( err, item, count ){
		        	    res.redirect('/'+ entity +'/edit/' + item._id);
		        	  });
	        	},
	        error: function (form) {
	        	Controller.prototype.render(res, 'pim/page/form.ejs', {
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
  
  /**
   * Save route
   */
   app.post('/'+entity+'/update/:id', function(req, res) {
  	 
	   var formInstance = new forms();
	   var form = formInstance.getEdit();
 	   var id 	= req.params.id;
	  
 	   form.handle(req, {
 	        success: function (form) {
 	        	  Item.findById(id, function(err, doc) {
 	        		  if (err) return res.status(404).render('pim/page/404.ejs');
 	        		  doc = merge(doc, form.data);
 	        		  doc.mdate = Date.now();
 	        		  
 	        		  doc.save( function ( err, item, count ){
 	        			res.redirect('/'+ entity +'/edit/' + item._id);
 	        	      });
 	      		});
 	        },
 	        error: function (form) {
 	        	Controller.prototype.render(res, 'pim/page/form.ejs', {
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

module.exports = CategoryController;