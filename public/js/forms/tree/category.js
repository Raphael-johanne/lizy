var CategoryTree = function(options){
	
	this.isDragAndDropAllowed = options.isDragAndDropAllowed || false;
	this.showInputs = options.showInputs || false;
	this.tree = {};
	this.productId = options.productId || null;

	this.init = function() {
		this.initPlugins();
	},

	this.initPlugins = function () {
		let plugins = [];

		if (this.isDragAndDropAllowed === true) {
			plugins.push('contextmenu');
			plugins.push('dnd');
			plugins.push('crrm');
			plugins.push('state');
			plugins.push('types');
			plugins.push('wholerow');
			this.initTree(plugins);

			this.initDragAndDrop();
		} else if (this.showInputs === true) {
			plugins.push('checkbox');
			plugins.push('state');
			plugins.push('massload');
			this.initTree(plugins);

			this.initHiddenField();
		}
	},

	this.initTree = function(plugins) {

		let productId = (this.productId !== null) ? '/' + this.productId : '';

		this.tree = $("#category_tree").jstree({
			 'core' : {
			    "animation" : 0,
	    		"check_callback" : true,
	    		"themes" : { "stripes" : true },
			  	'data' : {
				    'url' : function (node) {
				      return node.id === '#' ?
				        '/category/getChildrenByParent/no-parent' + productId:
				        '/category/getChildrenByParent/' + node.id + productId;
				    },
				    'data' : function (node) {
				      return { 'id' : node.id };
				    }
			  }
			}, 'massload' : {
				'url' : '/category/massload' + productId,
				 "data" : function (nodes) {
			        return { "ids" : nodes.join(",") };
			      }
			},
		  "plugins" : plugins
		});

		
	}

	this.initDragAndDrop = function() {
		this.tree.bind("move_node.jstree", function (e, data) {
	        $.ajax({	
	         	method: "POST",
	         	data : {position : data.position, parentId : data.parent, categoryId: data.node.id},
	            url : '/category/changeParent',
	            success : function(data){
	            	// @TODO Comfirm message
	            }
	        });
		});
	},

	this.initHiddenField = function() {
		$(document).on('click','#category_tree',function() {
		    var selectedElmsIds = $('#category_tree').jstree("get_selected");
		    $('#choosen_categories').val(selectedElmsIds.join());
		}); 
	}
}