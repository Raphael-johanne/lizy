/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var Controller 	= require("./controller.js");
var mongoose 	= require('mongoose');
var forms 		= require('../forms/channel');
var List 		= require('../services/list');
require('../models/channel');
require('../models/locale');
var util 		= require("util");
var Item     	= mongoose.model('channel');
var Locale     	= mongoose.model('locale');
var merge 		= require('merge');


function ChannelController() {
	Controller.call(this);
}

util.inherits(ChannelController, Controller);

ChannelController.controller = function(app, entity) {

  /**
  * List route
  */
  app.get('/'+entity+'/list/:p?/:limit?', function(req, res) {
	  var list = new List();
	  list.getList(
			  Item, 
			  entity, 
			  {'code':'Code', 'name':'Name', 'status':'Status'}, 
			  {'code':'Code', 'name':'Name', 'status':'Status'}, 
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
   * List route filter
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
	  
	  Controller.prototype.addFileToHead('forms/channel/form.js', 'js');
	  
	  Controller.prototype.once('locales_loaded', function(locales, form) {
    	  Controller.prototype.render(res, form.template, {
	    	  'form'	: form,
	    	  'action'	: '/'+entity+'/update/'+ id,
	    	  'locales': locales
	    	  }
	      );
    	  }
      );
	  
	  Item.findById(id, function(err, doc) {
		  if (err) return res.status(404).render('pim/page/404.ejs');
		 
		  var formInstance 	= new forms();
		  var form 			= formInstance.getEdit(doc);
		  
		  var countLocales = (typeof doc.locales.length === 'undefined')? 0 : doc.locales.length ;
		  var locales = [];
		  if (countLocales > 0) {
			  var i = 0;
			  doc.locales.forEach(function(item, index){
				  Locale.findById(item._id, function(err, doc) {
					  locales.push({_id : doc._id, name : doc.name});
					  i++;
					  
					  if (i == countLocales){
						  Controller.prototype.emit('locales_loaded', locales, form);
					  }
				  });
			  })
		  } else {
			  Controller.prototype.emit('locales_loaded', null, form);
		  }
		});
  	});
  	
   /**
   * Save route
   */
   app.post('/'+entity+'/save', function(req, res) {
  	 
 	  var formInstance	= new forms();
 	  var form 			= formInstance.getEdit();
 	   
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
   * Update route
   */
   app.post('/'+entity+'/update/:id', function(req, res) {
  	 
	   var formInstance = new forms();
	   var form 		= formInstance.getEdit();
 	   var id 			= req.params.id;
	  
 	   form.handle(req, {
 	        success: function (form) {
 	        	  Item.findById(id, function(err, doc) {
 	        		  if (err) return res.status(404).render('pim/page/404.ejs');
 	        		  
 	        		  doc = merge(doc, req.body);
 	        		  
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
   
   	/**
    * Get locales in JSON for channel add locales functionnality
    */
    app.get('/'+entity+'/locales', function(req, res) {
  	
  	  	var startWith = req.query.name_startsWith;
  	  	
  	  	var conditions = { 'code': new RegExp(startWith, 'i') }; 
  	  		  
  	  	Locale.find(conditions, "_id code name", function(err, docs) {
	  		res.setHeader('Content-Type', 'application/json');
	  		return res.send(JSON.stringify(docs));
		});
    });
}

module.exports = ChannelController;