/**!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */
require('../models/user');
var mongoose	= require('mongoose');
var User		= mongoose.model('user');
var bCrypt  	= require('bcryptjs');
var configService 	= require('../../core/services/config.js');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;

//Configuring Passport
var passport = require('passport');
app.use(session({secret: configService.secretKey}));
app.use(passport.initialize());
app.use(passport.session());

// passport/login.js
passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) { 
    // check in mongo if a user with username exists or not
    User.findOne({ 'username' :  username }, 
      function(err, user) {
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (!user){
          console.log('User Not Found with username '+username);
          return done(null, false, 
                req.flash('message', 'User Not found.'));                 
        }
        // User exists but wrong password, log the error 
        if (!isValidPassword(user, password)){
          console.log('Invalid Password');
          return done(null, false, 
              req.flash('message', 'Invalid Password'));
        }
        // User and password both match, return user from 
        // done method which will be treated like success
        return done(null, user);
      }
    );
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


//Generates hash using bCrypt
var createHash = function(password){
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

var isValidPassword = function(user, password){
	return bCrypt.compareSync(password, user.password);
};

app.set('passport', passport);