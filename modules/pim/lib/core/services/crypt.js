/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var bCrypt 		= require('bcryptjs');
var saltLength 	= 10;

module.exports = {
    /**
     * get default date export format
     * 
     * @return string
     */
	encrypt : function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(saltLength), null);
    }
 }