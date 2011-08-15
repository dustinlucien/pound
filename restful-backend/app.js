
/**
 * Module dependencies.
 */

// Express routing library
var express = require('express')
// RESTful routing helper
	, Resource = require('express-resource')
// For working with EventEmitters
	, events = require('events')
// For making HTTP requests
	, request = require('request')
// For connecting to MongoDB
	, mongoose = require('mongoose')

// Controllers
	, UserController = require( './app/controllers/users' )
	, KudosController = require( './app/controllers/kudos' );
	

/**
 * App configuration
 */
var app = module.exports = express.createServer();

// general config
app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

// development config
app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	console.log('connecting to mongoose for development');
	mongoose.connect('mongodb://testing_user:kud05@dbh30.mongolab.com:27307/development');
});

// production config
app.configure('production', function(){
	app.use(express.errorHandler());
	console.log('connecting to mongoose for production');
	mongoose.connect('mongodb://testing_user:kud05@dbh15.mongolab.com:27157/heroku_app563134');
});

// generic 404 message
app.use(function(req, res){
  res.send(404, { meta: { code : 404, error: "Lame, can't find that" }});
});

/**
 * Controllers
 */

var user_controller = new UserController();
app.resource('users', user_controller.router(), { format: 'json' });

var kudos_controller = new KudosController();
app.resource('kudos', kudos_controller.router(), { format: 'json' });

/**
 * Start the app!
 */
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Listening on " + port);
});

