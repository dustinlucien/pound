
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
// For interacting directly with redis	
	, redis = require('redis')
// For storing sessions in Redis
  , RedisStore = require('connect-redis')( express )
// For parsing and manipulating URL's
	, url = require('url')
	
// Controllers
	, UserController = require( './app/controllers/users' )
	, KudoCategoryController = require( './app/controllers/kudo-categories' )
	, KudoController = require( './app/controllers/kudos' )

// Middleware
  , AuthMiddleware = require( './app/lib/auth' );
	

/**
 * App configuration
 */
var app = module.exports = express.createServer();

// general config
app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(__dirname + '/public'));
	app.use(AuthMiddleware);
});

// development config
app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	console.log('connecting to Redis for sessions in development');
	app.use(express.session({store: new RedisStore, secret: 'mmmm javascript'}));
	console.log('connecting to mongoose for development');
	mongoose.connect('mongodb://localhost:27017/test');
	
	//put it here so that the session shit works.
	app.use(app.router);
});

// production config
app.configure('production', function(){
	app.use(express.errorHandler());
	console.log('connecting to Redis for sessions in production to ' + process.env.REDISTOGO_URL);
	var redisUrl = url.parse(process.env.REDISTOGO_URL),
	    redisAuth = redisUrl.auth.split(':');
	
	console.log('redisHost ' + redisUrl.hostname);
	console.log('redisPort ' + redisUrl.port);
	console.log('redisDb ' + redisAuth[0]);
	console.log('redisPass ' + redisAuth[1]);

	/*
	console.log('testing the redis connection ');
	var rClient = redis.createClient(app.set('redisPort'), app.set('redisHost'));
	
	rClient.on("error", function (err) {
	    console.log("Redis Error " + err);
	});
	
	rClient.auth(app.set('redisPass'), function(args) {
		console.log('callback fired from redis auth');
		console.log(args);
	});
	
	rClient.set("string key", "string val", redis.print);
	*/
	var rStore = new RedisStore({
      host: redisUrl.hostname,
      port: redisUrl.port,
			db: redisAuth[0],
      pass: redisAuth[1]
	});

	rStore.client.on('error', function(err) {
		console.log('error from connect-redis redis client connection');
		console.log(err);
	});
	
	rStore.client.on('ready', function() {
		console.log('RedisStore redis connection is ready');
	});
	
  app.use(express.session({secret: 'super duper secret', store: rStore}));

	console.log('connecting to mongoose for production');
	mongoose.connect('mongodb://testing_user:kud05@dbh15.mongolab.com:27157/heroku_app563134');
	
	//put it here so that the session shit works.
	app.use(app.router);
});

// generic 404 message
app.use(function(req, res){
  res.send( { meta: { code : 404, error: "Lame, can't find that" } }, 404 );
});

// import categories
require( './app/util/ensure-categories' )( true, function () {} );

/**
 * Controllers
 */

var user_controller = new UserController();
app.resource( 'users', user_controller.router() );

var kudo_category_controller = new KudoCategoryController();
app.resource( 'kudo_categories', kudo_category_controller.router() );

var kudo_controller = new KudoController();
app.resource( 'kudos', kudo_controller.router() );

/**
 * Start the app!
 */
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Listening on " + port);
});

