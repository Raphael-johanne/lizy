var express = require('express')
      ,http = require('http')
      ,path = require('path')
      ,session = require('express-session')
      ,fs = require('fs');
app = express();
/*i18n.configure({
    locales:['en', 'de', 'fr'],
    directory: __dirname + '/locales'
});*/
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));

//load modules
var i18n = require('i18n-2');

// Attach the i18n property to the express request object
// And attach helper methods for use in templates
i18n.expressBind(app, {
    // setup some locales - other locales default to en silently
    locales: ['en', 'de', 'fr'],
    // change the cookie name from 'lang' to 'locale'
    cookieName: 'locale'
});

app.use(function(req, res, next) {
    req.i18n.setLocaleFromCookie();
    next();
});

// database connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/nodejs_pim');

var cookieParser = require('cookie-parser')

app.use(cookieParser());

// some environment variables
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('root', __dirname);

app.use(express.static(path.join(__dirname, 'public')));

// dynamically include routes (Controller)
fs.readdirSync('./modules/pim/lib/pim/controllers').forEach(function (file) {
  var entity = file.substring(0, file.lastIndexOf('.'));
  if(file.substr(-3) == '.js') {
      var route = require('./modules/pim/lib/pim/controllers/' + file);
      route.controller(app, entity);
      
      app._router.stack.forEach(function(r){
    	  if (r.route && r.route.path){
    	  //  console.log(r.route.path)
    	  }
    	})
  }
});

var httpd = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/** 
 * build default io socket for the pim
 */
var io = require('socket.io').listen(httpd, { log: false });

app.set('io_default', io);