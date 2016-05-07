'use strict';

var tag = require('forms/lib/tag');

exports.media = function (options) {
	var opt = options || {};
    var w = {
        classes: opt.classes || options
    };
    
    w.toHTML = function (name, field) {
    	var f = field || {};
    
    	var attrs = {
            'src'   : (typeof f.value !== 'undefined' && f.value != "")?'/media/get/' + f.value:"",
            classes : w.classes,
            height  : 100,
    		width   : 100
        };
        
        var imgHTML 	= tag('img', [attrs, [], w.attrs || {}], opt.content);
        var imgHIDDEN 	= tag('input', {type:'hidden', name:f.name, value:f.value, 'id' : f.name});
        var imgLINK 	= tag('a', {class:'remove-media', href:'#'}, 'Remove');
        var imgUpdate 	= tag('input', {type:'file', "data_attribute_code" : f.name, class:'fileupload', "data-url":"/media/upload", multiple:"true", name:"file"}, 'Add/Change');
        
        return imgHTML + imgHIDDEN + imgLINK + imgUpdate; 
    };
    return w;
};
