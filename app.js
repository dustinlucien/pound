
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
// For storing sessions in Redis
  , RedisStore = require('connect-redis')( express )

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

function productionRedisSetup() {
	console.log('connecting to Redis for sessions in production to ' + process.env.REDISTOGO_URL);
	var redisUrl = url.parse(process.env.REDISTOGO_URL),
	    redisAuth = redisUrl.auth.split(':');

	console.log('redisHost ' + redisUrl.hostname);
	console.log('redisPort ' + redisUrl.port);
	console.log('redisDb ' + redisAuth[0]);
	console.log('redisPass ' + redisAuth[1]);
	
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
	
	return rStore;	
}

// development config
app.configure('development', function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.methodOverride());
	app.use(express.session({store: new RedisStore, secret: 'mmmm javascript'}));
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
	app.use(AuthMiddleware);
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	mongoose.connect('mongodb://localhost:27017/test');
});

// production config
app.configure('production', function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.logger('tiny'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.methodOverride());
  app.use(express.session({secret: 'super duper secret', store: productionRedisSetup()}));
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
	app.use(AuthMiddleware);	
	app.use(express.errorHandler());
	mongoose.connect('mongodb://testing_user:kud05@dbh15.mongolab.com:27157/heroku_app563134');
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

