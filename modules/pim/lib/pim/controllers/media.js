/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */
var Controller 		= require("./controller.js");
/*
 * @TODO Fix : no more relative path
 */
var mediaService 	= require("../../connector/service/media.js");
var util 			= require("util");
var fs 				= require('fs');
var multer  		= require('multer');
var upload 			= multer({ dest: '/tmp/' });
var mkdirp 			= require('mkdirp');

function MediaController() {
	Controller.call(this);
}

util.inherits(MediaController, Controller);

MediaController.controller = function(app, entity) {

   /**
   * get media preview
   */
   app.get('/'+entity+'/get/:a/:b/:c/:d/:e/:f/:g/:file', Controller.prototype.isAuthenticated, function(req, res) { 
   /**
    * @todo pass by regex route
    */
 	 var path 	= app.get('root') + '/' + req.params.a;
 	 path+='/' + req.params.b;
 	 path+='/' + req.params.c;
 	 path+='/' + req.params.d;
 	 path+='/' + req.params.e;
 	 path+='/' + req.params.f;
 	 path+='/' + req.params.g;
 	 path+='/' + req.params.file;
	 
 	 if (fs.existsSync(path) === true) {
 		var img = fs.readFileSync(path);
	     res.writeHead(200, {'Content-Type': 'image/gif' });
	     res.end(img, 'binary');
 	 } else {
 		res.writeHead(404, {'Content-Type': 'text/html' });
 	 }
   });
   
   /**
    * upload media
    */
    app.post('/'+entity+'/upload', upload.single('file'), Controller.prototype.isAuthenticated, function(req, res) { 
    	var sku 			= req.body.sku;
    	var eanMediaPath 	= mediaService.getEanMediaPath(sku);
		var fullMediaPath 	= mediaService.getFullMediaPath(sku, req.body.attributeCode, req.file.originalname);
			
		/**
		 * @TODO : duplicate entry code with pim connector product import,
		 * factory is necessary.
		 */
		mkdirp(eanMediaPath , function(err) { 
			if (err) {
				throw err;
			}
			fs.rename(req.file.path, fullMediaPath, function (err){
				if (err) {
					throw err;
				}
	    		res.setHeader('Content-Type', 'application/json');
	            res.send(JSON.stringify({fullMediaPath:fullMediaPath}));
	    		}
	    	);
		});
    });
}

module.exports = MediaController;