$( document ).ready(function() {
    if ($('#btn_create_job')) {
    	$('#btn_create_job').click(function(event) {
    		event.preventDefault();
    		
    	    $.ajax({
    	        type: 'GET',
    	        url: '/job/create',
    	        dataType: 'html',
    	        success: function(data) {    
    	            $.colorbox({html:data});
    	        }
    	    });
    	});
    }
});