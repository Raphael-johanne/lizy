var FamilyForm = function(options){
	
	this.alreadyAttributesUsed = options.alreadyAttributeUsed;
	
	var lastIndex = null;
	
	if ($('#family-add-attribute').length > 0) {
		$('#family-add-attribute').autocomplete({
		      source: function(req, res){ 
		    		$.ajax({
		                url : '/attribute/family/attributes',
		                dataType : 'json',
		                data : {
		                    name_startsWith : $('#family-add-attribute').val(), 
		                },
		                success : function(data){
		                	res($.map(data, function(object){
		                		return { label : object.title + " ["+object.code+"]", value : object.title, _id : object._id}; 
		                    }));
		                }
		            });
		        }, 
		        change: function( event, ui ) {
		        	this.addElement(
		        			ui.item._id,
		        			ui.item.value,
		        			false
		        	);
		        }.bind(this)
	    });
	}
	
	this.addElement = function (_id, label, required, index) {
		
		if (typeof index === 'undefined') {
			lastIndex = lastIndex+1;
			index = lastIndex;
		} else {
			lastIndex = parseInt(index);
		}
		
		var container = $('<tr/>');
		
		var td = $('<td/>');
		
		var label = $('<label/>').text(label);
		
		td.append(label);
		
		var td2 = $('<td/>');
		
		var input = $('<input/>', {
			'checked' : (required == 1) ? true:false, 
			'type' : 'checkbox',
			'name' : 'attributes['+index+'][required]'
		});
		
		td2.append(input);
		
		var input2 = $('<input/>', {
			'value' : _id,
			'type' : 'hidden',
			'name' : 'attributes['+index+'][_id]'
		});
		
		var td3 = $('<td/>');
		
		var link = $('<a/>', {
			'href':'#', 
		}).text("Remove");
		
		td3.append(link);
		
		link.click(function(event){
			event.preventDefault();
			$(this).parent().parent().remove();
		});
		
		container.append(td);
		container.append(td2);
		container.append(input2);
		container.append(td3);
		container.prependTo($('#family-attributes'));
	}
}
