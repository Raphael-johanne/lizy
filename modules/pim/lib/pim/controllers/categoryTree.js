/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var Controller 	= require("./controller.js");
var mongoose 	= require('mongoose');
require('../models/category.js');
var Item     	= mongoose.model('category');
var util 		= require("util");

function CategoryTreeController() {
	Controller.call(this);
}

util.inherits(CategoryTreeController, Controller);

CategoryTreeController.controller = function(app, entity) {

	/**
	* get children categories by parent
	*/
    app.get('/category/getChildrenByParent/:parentId?', Controller.prototype.isAuthenticated, function(req, res) {
	    var parentId = (req.params.parentId == '') ? null: req.params.parentId;
	  
	  	Item.find({parent:parentId}, "_id title", function(err, docs) {
	  		res.setHeader('Content-Type', 'application/json');
	  		return res.send(JSON.stringify(docs));
		});
  	});

  	/**
  	* Change parent
   	*/
   	app.post('/category/changeParent', Controller.prototype.isAuthenticated, function(req, res) {
	  
   	});
}

module.exports = CategoryTreeController;
