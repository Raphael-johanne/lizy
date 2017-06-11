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
	  
	  	Item.find({parent:parentId}, "_id title", {sort:{position: 1}}, function(err, docs) {
	  		res.setHeader('Content-Type', 'application/json');

	  		let children = [];

	  		docs.forEach(function(item, index){
	  			children.push({text:item.title, id:item.id, children:true});
	  		});

	  		return res.send(JSON.stringify(children));
		});
  	});

  	/**
  	* Change parent
   	*/
   	app.post('/category/changeParent', Controller.prototype.isAuthenticated, function(req, res) {
	   var data = req.body;

	   Item.findById(data.parentId, "_id", function(err, parent) {

	   		if (err) return res.status(404).render('pim/page/404.ejs');

			Item.findById(data.categoryId, "_id", function(err, doc) {

				if (err) return res.status(404).render('pim/page/404.ejs');

				let direction = 1;
				doc.parent = parent._id;
				
				if (data.position < doc.position) {
					direction = -1;	
				}

				doc.position = data.position;

				doc.save( function ( err, currentItem, count ){
				
					Item.find({parent:data.parentId}, {}, {sort:{position: 1}}, function(err, docs){
						docs.forEach(function(brotherItem, index){
							if (String(brotherItem._id) != String(currentItem._id)) {
								brotherItem.position += 1*direction;
								brotherItem.save(function(err, item, count){});
							}
						});
					});
 	        		res.setHeader('Content-Type', 'application/json');
	  				return res.send(JSON.stringify(currentItem));
 	        	});
	  		});
		});
   	});
}

module.exports = CategoryTreeController;
