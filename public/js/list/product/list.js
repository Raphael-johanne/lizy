$( document ).ready(function() {
    if ($('#btn_create_product')) {
    	$('#btn_create_product').click(function(event) {
    		event.preventDefault();
    		
    	    $.ajax({
    	        type: 'GET',
    	        url: '/product/create',
    	        dataType: 'html',
    	        success: function(data) {    
    	            $.colorbox({html:data});
    	        }
    	    });
    	});
    }
});