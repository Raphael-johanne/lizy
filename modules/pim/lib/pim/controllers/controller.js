/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */
var moment = require('moment');
var templateData = {};
var events = require("events");
var util = require("util");
var ORIGIN_FILE_TYPE = 'origin';
var debug = require('../../core/services/debug.js');

function Controller() {
	this.debug = debug;
}

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

//As with any middleware it is quintessential to call next()
//if the user is authenticated
Controller.prototype.isAuthenticated = function (req, res, next) {
if (req.isAuthenticated())
return next();
res.redirect('/');
}

Controller.prototype.addFileToHead = function(path, type) {
	
	if (typeof templateData.head === 'undefined') {
		templateData.head = [];
	}
	
	if (typeof templateData.head[type] === 'undefined') {
		templateData.head[type] = [];
	}
	
	if (type === null) {
		type = ORIGIN_FILE_TYPE;
		templateData.head[type] = [];
	}
	
	if (templateData.head[type].indexOf(path) == -1) {
		templateData.head[type].push(path);
	}
}

Controller.controller = function(app, entity) {};

module.exports = Controller;