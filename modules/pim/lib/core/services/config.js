/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var DEFAULT_DATE_FORMAT = 'YYYY/MM/DD HH:mm';

var fs = require('fs');

module.exports = {
    /**
     * get default date export format
     * 
     * @return string
     */
	getDefaultDateFormat : function() {
        return DEFAULT_DATE_FORMAT;
    },

    /**
     * get config depends on env
     * 
     * @return object
     */
    getConfigByEnv : function(env) {
    	var path = app.get('root') + '/modules/pim/lib/core/config/'+ env +'.js';
        if (fs.statSync(path).isFile()){
        	console.log('Read ' + path + ' for env ' + env);
        	return require(path);
        } else {
        	console.log('Cannot read ' + path + ' for env ' + env + '. The file probably does not exist.');

            return false;
        }
      
    }
 }
