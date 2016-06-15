var ChannelForm = function(options){
	
	var lastIndex = null;
	
	if ($('#channel-add-locale').length > 0) {
		$('#channel-add-locale').autocomplete({
		      source: function(req, res){ 
		    		$.ajax({
		                url : '/channel/locales',
		                dataType : 'json',
		                data : {
		                    name_startsWith : $('#channel-add-locale').val(), 
		                },
		                success : function(data){
		                	res($.map(data, function(object){
		                		return { label : object.name + " ["+object.code+"]", value : object.name, _id : object._id}; 
		                    }));
		                }
		            });
		        }, 
		        change: function( event, ui ) {
		        	this.addElement(
		        			ui.item._id,
		        			ui.item.value
		        	);
		        }.bind(this)
	    });
	}
	
	this.addElement = function (_id, label, index) {
		
		if (typeof index === 'undefined') {
			lastIndex 	= lastIndex+1;
			index 		= lastIndex;
		} else {
			lastIndex = parseInt(index);
		}
		
		var container = $('<tr/>');
		
		var td = $('<td/>');
		
		var label = $('<label/>').text(label);
		
		td.append(label);
		
		var input2 = $('<input/>', {
			'value' : _id,
			'type' : 'hidden',
			'name' : 'locales['+index+'][_id]'
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
		container.append(input2);
		container.append(td3);
		container.prependTo($('#channel-locales'));
	}
}