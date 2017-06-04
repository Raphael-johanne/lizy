var CategoryTree = function(options){
	
	this.isDragAndDropAllowed = options.dragAndDropAllowed || false;
	this.showInputs = options.showInputs || false;

	this.init = function () {
		this.initDragAndDrop();
		this.initRootList();
	},

	this.initRootList = function() {
		this.getChildrenByParent(null, function(children){
			this.createList(children, null);
		}.bind(this));
	},

	this.getChildrenByParent = function(parentId, callback) {
		parentId = (parentId) ? parentId : '';
		$.ajax({
            url : '/category/getChildrenByParent/' + parentId,
            success : function(data){
            	callback(data);
            }
        });
	},

	this.createList = function (children, parentId) {
	
		var ulEl = $('<ul/>');

		if ($('#parent_' + parentId).length > 0 
			&& $('#parent_' + parentId).next().is('ul')) {
			$('#parent_' + parentId).next().remove();
		} else {
			children.forEach(function(item, index) {

				var aEl = $('<a/>', {id:'parent_'+item._id, title:item.title, text:item.title});
				aEl.click(function(event){
					event.preventDefault();
					this.getChildrenByParent(item._id, function(children){
						this.createList(children, item._id);
					}.bind(this));
				}.bind(this));

				var liEl = $('<li/>');
				
				if (this.showInputs === true) {
					var inputEl = $('<input/>', {type:'checkbox', name:'selected_category_tree_item[]', value:item._id});
					liEl.append(inputEl);					
				}

				liEl.append(aEl);
				ulEl.append(liEl);
			}.bind(this))

			if (parentId === null) {
				$("#category_tree").append(ulEl);
			} else {
				ulEl.insertAfter($('#parent_' + parentId));
			}
		}
	},

	this.initDragAndDrop = function() {
		if (this.isDragAndDropAllowed === false) {
			return;
		}
	}
}