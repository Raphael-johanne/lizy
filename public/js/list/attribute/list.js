$( document ).ready(function() {
    if ($('#btn_create_attribute')) {
    	$('#btn_create_attribute').click(function(event) {
    		event.preventDefault();
    		
    	    $.ajax({
    	        type: 'GET',
    	        url: '/attribute/type/choices',
    	        dataType: 'html',
    	        success: function(data) {    
    	            $.colorbox({html:data});
    	        }
    	    });
    	});
    }
});