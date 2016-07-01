/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var debugAvailable = true;

module.exports = {
    /**
     * Dump to use forshell treatment
     * 
     * @return string
     */
	dump : function(data) {
		
		if (debugAvailable === false) {
			return null;
		}
		
		if (Array.isArray(data)) {
			log = data;
		} else {
			log = JSON.stringify(data);
		}
		
        return console.log(log);
    }
 }