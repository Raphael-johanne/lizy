var ProductForm = function(options){
	if ($('#product-set-family').length > 0) {
		$('#product-set-family').autocomplete({
		      source: function(req, res){ 
		    		$.ajax({
		                url : '/family/product/families',
		                dataType : 'json',
		                data : {
		                    name_startsWith : $('#product-set-family').val(), 
		                },
		                success : function(data){
		                	res($.map(data, function(object){
		                		return { label : object.title + " ["+object.code+"]", value : object.title, _id : object._id}; 
		                    }));
		                }
		            });
		        }, 
		        change: function( event, ui ) {
		        	$('#product-family-id').val(ui.item._id);
		        }
	    });
	}
	
}
