/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var events = require("events");
var util = require("util");
var Reader 		= require("../reader.js");

function MongoReader(config) {}

util.inherits(MongoReader, Reader);

MongoReader.prototype.find = function(model, conditions, fields, callback) {
	model.find(conditions, fields, function(err, docs) {
		  if (err) throw (err);
		  return callback(docs);
		}
	);
};

module.exports = MongoReader;
