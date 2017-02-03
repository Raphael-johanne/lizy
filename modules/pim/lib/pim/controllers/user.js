/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var Controller 	= require("./controller.js");
var mongoose 	= require('mongoose');
var forms 		= require('../forms/user');
var List 		= require('../services/list');
require('../models/user');
var util 		= require("util");
var Item     	= mongoose.model('user');
var merge 		= require('merge');
var Format 		= require('../../core/services/format');
var Crypt 		= require('../../core/services/crypt');

function UserController() {
	Controller.call(this);
}

util.inherits(UserController, Controller);

UserController.controller = function(app, entity) {

  /**
  * List route
  */
  app.get('/'+entity+'/list/:p?/:limit?', Controller.prototype.isAuthenticated, function(req, res) {
	  
	  var list = new List();
	  list.getList(Item, entity, {'login':'login', 'email':'Email'}, {'login':'login', 'email':'Email'}, req, function(err, docs, fields, filtersFormHtml, paginationHtml) {
		  
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
   * Remove route
   */
   app.get('/'+entity+'/remove/:id', Controller.prototype.isAuthenticated, function(req, res) {
 	
 	  var id 	= req.params.id;
 	  
 	  Item.findById(id, function(err, doc) {
 		  if (err) return res.status(404).render('pim/page/404.ejs');
 		 
 		 doc.remove(function (err, doc ){
 		      if (err) return next( err );
 		      req.session.message = {type:'success', message: 'User has been succesfully removed'};
 		      res.redirect( '/'+entity+'/list' );
 		    });
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
	        	
	        	form.data.password = Crypt.encrypt(form.data.password);
	        	req.session.message = {type:'success', message: 'User has been succesfully created'};
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
 	        		  
 	        		  doc.password = Crypt.encrypt(doc.password);
 	        		  req.session.message = {type:'success', message: 'User has been succesfully updated'};
 	        		  doc.save( function ( err, item, count ){
 	        			res.redirect('/'+ entity +'/edit/' + item._id);
 	        	      });
 	      		});
 	        },
 	        error: function (form) {
                req.session.message = {type:'danger', message: 'An error append'};
 	        	Controller.prototype.render(res, 'pim/page/form.ejs', {
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

module.exports = UserController;
