/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var Controller 	= require("./controller.js");
var mongoose 	= require('mongoose');
require('../models/category.js');
require('../models/product.js');
var Item     	= mongoose.model('category');
var productItem = mongoose.model('product');
var util 		= require("util");

function CategoryTreeController() {
	Controller.call(this);
}

util.inherits(CategoryTreeController, Controller);

CategoryTreeController.getProductCategories = function (productId, callback) {
	if (productId === null) return callback([]);

	productItem.findById(productId, "categories", function(err, doc) {
		return callback(doc.categories);
	})
}

CategoryTreeController.controller = function(app, entity) {
	/**
	* get children categories by parent bind data if product is provided
	*/
    app.get('/category/getChildrenByParent/:parentId?/:productId?', Controller.prototype.isAuthenticated, function(req, res) {
	    let parentId = (req.params.parentId == 'no-parent') ? null: req.params.parentId;
	    let productId = (req.params.productId == '') ? null: req.params.productId;

	    CategoryTreeController.getProductCategories(productId, function(productCategories) {
	    	Item.find({parent:parentId}, "_id title", {sort:{position: 1}}, function(err, categories) {
	  			res.setHeader('Content-Type', 'application/json');
	  			let children = [];
				categories.forEach(function(category, index){
					let formatedCategory = {text:category.title, id:category.id, children:true};

					if (productCategories.indexOf(category.id) !== -1) {
						formatedCategory.state = { selected: true };
					}

	  				children.push(formatedCategory);
	  			});
	  			return res.send(JSON.stringify(children));
	  		
			});
	    })
  	});

    app.get('/category/test/:productId', Controller.prototype.isAuthenticated, function(req, res) {
	   
	    let productId = (req.params.productId == '') ? null: req.params.productId;

	    CategoryTreeController.getProductCategories(productId, function(productCategories) {
  			res.setHeader('Content-Type', 'application/json');
  			return res.send(JSON.stringify(productCategories));
	    })
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

				doc.save( function ( err, currentItem, count ) {
				
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
