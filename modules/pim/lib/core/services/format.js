/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var finalKey = null;
function Format() {}

Format.prototype = {
	
    /**
     * format Object To Underscore
     * 
     * @return string
     */
	objectToUnderscore : function(object) {
		var formatedData 	= [];
		
		Object.keys(object).forEach(function(field, index) {
			Format.prototype.getObjectToUnderscoreRecursiveBuildValue(object[field], field, function(data) {
				formatedData[data[0]] = data[1];
			});
		});

		return formatedData;
    },
   
    /** 
     * get Object To Underscore Recursive Build Value
     */
	getObjectToUnderscoreRecursiveBuildValue : function(field, finalKey, callback) {
		
		if (!(field instanceof Object)) {
			callback([finalKey,field]);
		} else {
			Object.keys(field).forEach(function(key) {
				
				var value = field[key];
				
				if (finalKey === null) {
					finalKey = key;
				} else {
					finalKey += '_'+key;
				}
				Format.prototype.getObjectToUnderscoreRecursiveBuildValue(value, finalKey, callback);
			});
		}
	}
}
module.exports = Format;