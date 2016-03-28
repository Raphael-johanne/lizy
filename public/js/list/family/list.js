$( document ).ready(function() {
    if ($('#btn_create_family')) {
    	$('#btn_create_family').click(function(event) {
    		event.preventDefault();
    		
    	    $.ajax({
    	        type: 'GET',
    	        url: '/family/create',
    	        dataType: 'html',
    	        success: function(data) {    
    	            $.colorbox({html:data});
    	        }
    	    });
    	});
    }
});