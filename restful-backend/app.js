
/**
 * Module dependencies.
 */

var express = require('express')
//RESTful routing helper
	, Resource = require('express-resource')
	, events = require('events')
	, request = require('request');

// Configuration
var app = module.exports = express.createServer();

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
	app.use(express.errorHandler()); 
});


//Wire up the controllers
app.resource('users', require('./app/controllers/users'), { format: 'json' });
app.resource('kudos', require('./app/controllers/kudos'), { format: 'json' });

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Listening on " + port);
});
