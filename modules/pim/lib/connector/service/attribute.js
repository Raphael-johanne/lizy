/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var http = require('http');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

module.exports = {
    getAttributeTypeCodes:function() {
        return [
        	'text',
        	'select',
        	'media',
        	'textarea'
        ];
    },
    
    validate:function(attributes, data, callback){
    	var availablesType = module.exports.getAttributeTypeCodes();
    	var errors = [];
    	
    	attributes.forEach(function(attribute, index){
    		
    		/**
    		 * @todo check why it can be undefined
    		 */
    		if(typeof data[attribute.code] != 'undefined') {
        		if (availablesType.indexOf(attribute.type) == -1){
        			errors.push('the type '+attribute.type+' is not available');
        		} else if (module.exports.validateRequired(attribute, data[attribute.code]) === false){
        			errors.push(attribute.code +' is required for ean '+ data.ean);
        		} else {
        			switch (attribute.type) {
	        			case 'select':
	        				if (module.exports.validateValueInValues(attribute, data[attribute.code]) === false) {
	        					errors.push('The value '+ data[attribute.code] +' is not available for attribute ' + attribute.code + ' for ean ' + data.ean);
	        				}
	        				break;
	        			case 'media':
	        				
	        				var eanPath = 'modules/pim/media/' + data.sku[0] + "/" + data.sku[1] + "/" + data.sku[2] + "/" + data.sku[3];
	        				
 	        				mkdirp(eanPath , function(err) { 
 	        					var filePath = eanPath + "/" + data.sku + "_" + attribute.code + path.extname(data[attribute.code]);
 	        					var httpMedia = data[attribute.code];
 	        					data[attribute.code] = filePath;
 	        					var file = fs.createWriteStream(filePath);
 		        				var request = http.get(httpMedia, function(response) {
 		        					response.pipe(file);
 		        				});
	        				});
	        				
 	        				break;
	        			}
        		}
    		}
    		
    		// console.log(JSON.stringify(attribute.code));
    	});
    	
    	callback(errors, data);
    },
    
    validateRequired:function(attribute, data){
    	return (attribute.required == 1)? data.replace(/^\s+/g, '').length > 0:true;
    },
    
    validateValueInValues:function(attribute, data){
    	return true;
    	//return (attribute.required == 1)? data.replace(/^\s+/g, '').length:true;
    },
}