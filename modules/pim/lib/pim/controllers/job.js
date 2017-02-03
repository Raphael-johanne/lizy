/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var Controller 	= require("./controller.js");
var mongoose 	= require('mongoose');
var forms 		= require('../forms/job');
var List 		= require('../services/list');
require('../models/job');
var util 		= require("util");
var Item     	= mongoose.model('job');
var merge 		= require('merge');
/*
 * @TODO Fix : no more relative path
 */
var Step = require('../../connector/step/step');
var JobExecution = require('../../connector/service/jobExecution');

function JobController() {
	Controller.call(this);
}

util.inherits(JobController, Controller);

JobController.controller = function(app, entity) {

  /**
  * Execute job
  */
  app.get('/'+entity+'/execute/:code', Controller.prototype.isAuthenticated, function(req, res) {
	  
	  var code 			= req.params.code;
	  var jobExecution  = new JobExecution();
	  
	  Controller.prototype.addFileToHead('/socket.io/socket.io.js', null);
	  Controller.prototype.addFileToHead('job/execution.js', 'js');
	  
	  app.get('io_default').on('connection', function(socket){
		  jobExecution.on('job_execution_report', function(notifications) {
	   	    	socket.emit('job_execution_report_socket', JSON.stringify(notifications));
	   	  });
	  });
	  
   	  Item.findOne({'code':code}, {}, function(err, doc) {
   		  if (err) return res.status(404).render('pim/page/404.ejs');
  
   		  var step = new Step();
 		  
   		  step.init(doc.config, jobExecution);
   		  step.lunch();
   		});
   	  
   	  Controller.prototype.render(res, req, 'pim/page/job/execution.ejs', {
   		  protocol : req.protocol,
   		  host     : req.hostname,
   		  port     : app.get('port'),
   		  jobCode  : code
	  });
  });
	
  /**
  * List route
  */
  app.get('/'+entity+'/list/:type?/:p?/:limit?', Controller.prototype.isAuthenticated, function(req, res) {
	  /*
	  var job = {
			  code 			: "export_category_csv",
			  name 			: "Export categories in CSV",
			  type 			: "export",
			  config : {
				  path : "modules/pim/export/categories.csv",
				  connector : {
					  reader : "mongo/reader",
					  processor : "processor",
					  writer : "csv/csvWriter"
				  },
				  fields : "code title cdate mdate",
				  collection : "category"
			  }
	  };
	  new Item(job).save( function( err, item, count ){
  	   console.log('dine');
  	  });
	  */
	  
	  var list = new List();
	  
	  var type = req.params.type;
	  
	  if (type) {
		  req.session[entity + '_filters_list'] = {type : type};
	  }
	  
	  Controller.prototype.addFileToHead('list/job/list.js', 'js');
	  
	  list.getList(Item, entity, {'code':'Code', 'name':'Name',  'type':'Type'}, {'code':'Code', 'name':'Name', 'type':'Type'}, req, function(err, docs, fields, filtersFormHtml, paginationHtml) {
		  
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
    * Create product, only code and family is required
    */
    app.get('/'+entity+'/create', Controller.prototype.isAuthenticated, function(req, res) {
    	var formInstance = new forms();
   	  	var form = formInstance.getCreate();
   	  	
   	  	Controller.prototype.addFileToHead('forms/job/form.js', 'js');
   	  	
   	  	Controller.prototype.renderPopin(res, form.template, {
 	    	  'form' : form,
 	    	  'action' : '/'+entity+'/save'
 	    	  }
 	      );
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
 		     
                req.session.message = {type:'success', message: 'Job has been succesfully removed'};

 		      res.redirect( '/'+entity+'/list' );
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
                    req.session.message = {type:'success', message: 'Job has been succesfully created'};
	        		new Item(form.data).save( function( err, item, count ){
		        	    res.redirect('/'+ entity +'/edit/' + item._id);
		        	  });
	        	},
	        error: function (form) {
                req.session.message = {type:'danger', message: 'An error append'};
	        	return res.redirect('/'+ entity +'/list');
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
	   var form = formInstance.getEdit(req.body);
 	   var id 	= req.params.id;
	   
 	   form.handle(req, {
 	        success: function (form) {
 	        	  Item.findById(id, function(err, doc) {
 	        		  if (err) return res.status(404).render('pim/page/404.ejs');
 	        		  doc = merge(doc, form.data);
	        		  doc.mdate = Date.now();
 	        		  req.session.message = {type:'success', message: 'Job has been succesfully updated'};
 	        		  doc.save( function ( err, item, count ){
 	        			res.redirect('/'+ entity +'/edit/' + item._id);
 	        	      });
 	      		});
 	        },
 	        error: function (form) {
                req.session.message = {type:'danger', message: 'An error append'};
 	        	Controller.prototype.render(res, 'pim/page/form.ejs', {
 		  	    	  'form'	: form,
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

module.exports = JobController;
