
/**
 * Module dependencies.
 */

var express = require('express')
//RESTful routing helper
	, Resource = require('express-resource')
	, events = require('events')
	, request = require('request')
	, mongoose = require('mongoose');
	

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
	console.log('connecting to mongoose for development');
	mongoose.connect('mongodb://testing_user:kud05@dbh30.mongolab.com:27307/development');
});

app.configure('production', function(){
	app.use(express.errorHandler());
	console.log('connecting to mongoose for production');
	mongoose.connect('mongodb://testing_user:kud05@dbh15.mongolab.com:27157/heroku_app563134');
});

app.use(function(req, res){
  res.send(404, { meta: { code : 404, error: "Lame, can't find that" }});
});

//Wire up the controllers
app.resource('users', require('./app/controllers/users'), { format: 'json' });
app.resource('kudos', require('./app/controllers/kudos'), { format: 'json' });

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Listening on " + port);
});
