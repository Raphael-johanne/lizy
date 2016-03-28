/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */
var moment = require('moment');
var templateData = {};
var events = require("events");
var util = require("util");

function Controller() {}

util.inherits(Controller, events.EventEmitter);

Controller.prototype.render = function(res, template, data) {
	app.render(template, data, function (err, html) {
		res.render('pim/page/index.ejs', { body: html , moment: moment, templateData : templateData});
	})
};

Controller.prototype.renderPopin = function(res, template, data) {
	app.render(template, data, function (err, html) {
		res.render('pim/page/popin.ejs', { body: html , templateData : templateData});
	})
};

Controller.prototype.addFileToHead = function(path, type) {
	
	if (typeof templateData.head === 'undefined') {
		templateData.head = [];
	}
	
	if (typeof templateData.head[type] === 'undefined') {
		templateData.head[type] = [];
	}
	
	if (templateData.head[type].indexOf(path) == -1) {
		templateData.head[type].push(path);
	}
}


Controller.controller = function(app, entity) {};

module.exports = Controller;