/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var path 	= require('path');
var fs		= require('fs');

module.exports = {
    getEanMediaPath:function(sku) {
        return 'modules/pim/media/' 
        + sku[0] 
        + "/" + sku[1] 
        + "/" + sku[2] 
        + "/" + sku[3];
    },
    
    getFullMediaPath : function(sku, attributeCode, fileName){
    	return this.getEanMediaPath(sku) 
    	+ "/" + sku + "_" + attributeCode + "_" + fileName;
    },
    
    removeMediaBySku : function(sku){
    	fs.unlink(this.getEanMediaPath(sku) + "/" + sku + "*", function(){
    		/**
    		 * @TODO notify customer with JSON response
    		 */
    	});
    }
}