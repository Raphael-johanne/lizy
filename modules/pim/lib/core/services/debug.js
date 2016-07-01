/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

module.exports = {
    /**
     * Dump to use forshell treatment
     * 
     * @return string
     */
	dump : function(data) {
		if (Array.isArray(data)) {
			log = data;
		} else {
			log = JSON.stringify(data);
		}
		
        return console.log(log);
    }
 }