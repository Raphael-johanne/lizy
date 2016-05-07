var ProductForm = function(options){
	if ($('#product-set-family').length > 0) {
		$('#product-set-family').autocomplete({
		      source: function(req, res){ 
		    		$.ajax({
		                url 		: '/family/product/families',
		                dataType 	: 'json',
		                data 		: {
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
	
	$('.remove-media').each(function(index, item){
		$(item).click(function(event){
			event.preventDefault();
			$(this).prev().prev().attr("src", "");
			$(this).prev().val("");
		})
	});
	
	$('.fileupload').each(function (index, item) {
		var attr = item.getAttribute('data_attribute_code');
		$(item).fileupload({
	    	dataType: 'json',
	    	formData: {"sku":$("#id_sku").val(), "attributeCode": attr},
	        done: function (e, data) {
	            $.each(data.files, function (index, file) {
	            	$('#' + attr).val(data.result.fullMediaPath);
	            	$('#' + attr).prev().attr('src','/media/get/' + data.result.fullMediaPath);
	                $('<p/>').text(file.name).appendTo($(item));
	            });
	        }
	    });
	});
}