/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 */

var config 			= {};
config.application 	= {};
config.mongodb 		= {};
config.locales 		= {};
config.secretKey 	= "please_replace_me";

/**
 * Application configuraion
 */
config.application.port 		= '3000';
config.application.cookieMaxAge = '60000'; 

/**
 * MongoDb configuraion
 */
config.mongodb.protocol 	=  'mongodb';
config.mongodb.host 		=  'localhost';
config.mongodb.port 		=  '27017';
config.mongodb.database 	=  'lizy';

/**
 * Availabale locale for interface 
 */
config.locales.available = ['fr', 'en'];

module.exports = config;