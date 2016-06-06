/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var mongoose = require('mongoose');

function testCommand(parameters) {
	this.code = parameters.code;
	this.env  = parameters.env;
}

/**
 * Test pim installation
 */
testCommand.prototype.execute = function() {
	
}

module.exports = testCommand;