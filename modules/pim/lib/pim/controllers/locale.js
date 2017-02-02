/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var Controller 	= require("./controller.js");
var mongoose 	= require('mongoose');
var forms 		= require('../forms/locale');
var List 		= require('../services/list');
require('../models/locale');
var util 		= require("util");
var Item     	= mongoose.model('locale');
var merge 		= require('merge');

function LocaleController() {
	Controller.call(this);
}

util.inherits(LocaleController, Controller);

LocaleController.controller = function(app, entity) {

  /**
  * List route
  */
  app.get('/'+entity+'/list/:p?/:limit?', Controller.prototype.isAuthenticated, function(req, res) {
	  var list = new List();
	  list.getList(Item, entity, {'code':'Code', 'name':'Name', 'status':'Status'}, {'code':'Code', 'name':'Name', 'status':'Status'}, req, function(err, docs, fields, filtersFormHtml, paginationHtml) {
		  
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
   * List route
   */
   app.post('/'+entity+'/list', Controller.prototype.isAuthenticated, function(req, res) {
	   req.session[entity + '_filters_list'] = req.body;
	   res.redirect('/'+entity+'/list');
   });

  /**
   * Create route
   */
   app.get('/'+entity+'/create', Controller.prototype.isAuthenticated, function(req, res) {
	  
	  var formInstance = new forms();
	  var form = formInstance.getEdit();
	  
	  Controller.prototype.render(res, req, 'pim/page/form.ejs', {
    	  'form'	: formInstance.getHtml(form),
    	  'action'	: '/'+entity+'/save'
    	  });
   });  
  
  /**
  * Edit route
  */
  app.get('/'+entity+'/edit/:id', Controller.prototype.isAuthenticated, function(req, res) {
	
	  var id = req.params.id;
	  
	  Item.findById(id, function(err, doc) {
		  if (err) return res.status(404).render('pim/page/404.ejs');
		 
		  var formInstance = new forms();
		  var form = formInstance.getEdit(doc);
		  
		  Controller.prototype.render(res, req, 'pim/page/form.ejs', {
	    	  'form'	: formInstance.getHtml(form),
	    	  'action'	: '/'+entity+'/update/'+ id
	    	  }
	      );
		});
  });
  
  /**
   * Save route
   */
   app.post('/'+entity+'/save', Controller.prototype.isAuthenticated, function(req, res) {
  	 
 	  var formInstance = new forms();
 	  var form = formInstance.getEdit();
 	   
 	   form.handle(req, {
 	        success: function (form) {
                    req.session.message = {type:'success', message: 'Locale has been succesfully created'};
 	        		new Item(form.data).save( function( err, item, count ){
 		        	    res.redirect('/'+ entity +'/edit/' + item._id);
 		        	  });
 	        	},
 	        error: function (form) {
                req.session.message = {type:'danger', message: 'An error append'};
 	        	Controller.prototype.render(res, req, 'pim/page/form.ejs', {
 	  	    	  'form'	: formInstance.getHtml(form),
 	  	    	  'action'	: '/'+entity+'/save'
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
 	        		  doc = merge(doc, form.data);
 	        		  doc.mdate = Date.now();
 	        		  req.session.message = {type:'success', message: 'Locale has been succesfully updated'};
 	        		  doc.save( function ( err, item, count ){
 	        			res.redirect('/'+ entity +'/edit/' + item._id);
 	        	      });
 	      		});
 	        },
 	        error: function (form) {
                req.session.message = {type:'danger', message: 'An error append'};
 	        	Controller.prototype.render(res, req, 'pim/page/form.ejs', {
 		  	    	  'form'	: formInstance.getHtml(form),
 		  	    	  'action'	: '/'+entity+'/save'
 		  	    	  }
 	  	      );
 	        },
 	        empty: function (form) {
                req.session.message = {type:'danger', message: 'An error append'};
 	        	return res.status(404).render('pim/page/404.ejs');
 	        }
 	    });
    });
}

module.exports = LocaleController;
