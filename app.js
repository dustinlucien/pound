
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
	
//url for manipulating urls	
	, url = require('url')
// For storing sessions in Redis
	, RedisStore = require('connect-redis')( express )
// Controllers
	, UserController = require( './app/controllers/users' )
	, KudoCategoryController = require( './app/controllers/kudo-categories' )
	, KudoController = require( './app/controllers/kudos' )
	, LikeController = require( './app/controllers/likes' )
// Middleware
	, AuthMiddleware = require( './app/lib/auth' );
	
/**
 * App configuration
 */
var app = module.exports = express.createServer();

function productionRedisSetup() {
	console.log('connecting to Redis for sessions in production to ' + process.env.REDISTOGO_URL);
	var redisUrl = process.env.REDISTOGO_URL;
	
	if (!redisUrl) {
		redisUrl = "redis://redistogo:1fa9a5e3f75d1620ae83ebcf05dd884d@filefish.redistogo.com:9623/";
	}
	
	redisUrl = url.parse(redisUrl);
	var redisAuth = redisUrl.auth.split(':');

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
	app.use(express.static(__dirname + '/public'));
	app.use(AuthMiddleware);
	app.use(app.router);
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	mongoose.connect('mongodb://testing_user:kud05@dbh30.mongolab.com:27307/development');
	//mongoose.connect('mongodb://localhost:27017/test');
});

// production config
app.configure('production', function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.logger(':method :url :status :res[content-length] - :response-time ms'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.methodOverride());
	app.use(express.session({store: productionRedisSetup(), secret: 'super duper secret'}));
	app.use(express.static(__dirname + '/public'));
	app.use(AuthMiddleware);	
	app.use(app.router);
	app.use(express.errorHandler());
	mongoose.connect('mongodb://testing_user:kud05@dbh15.mongolab.com:27157/heroku_app563134');
	//Avoid crashes on Heroku
	process.on('uncaughtException', function (err) {
		console.log('Caught exception: ' + err);
	});
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
var user_resource = app.resource( 'users', user_controller.router() );

//Looks weird, seems awkward.  Easier way? -- Dustin
user_resource.map('get', 'kudos/:stream', function () {
	user_controller.kudos.apply( user_controller, arguments );
});

var kudo_category_controller = new KudoCategoryController();
app.resource( 'kudo_categories', kudo_category_controller.router() );

var kudo_controller = new KudoController();
var kudo_resource = app.resource( 'kudos', kudo_controller.router() );

kudo_resource.map( 'get', 'gloms', function () {
	kudo_controller.gloms.apply( kudo_controller, arguments );
});

kudo_resource.map( 'get', 'likes', function () {
	kudo_controller.likes.apply( kudo_controller, arguments );
});

kudo_resource.map( 'post', 'likes', function () {
	kudo_controller.create_like.apply( kudo_controller, arguments );
});

var like_controller = new LikeController();
var like_resource = app.resource( 'likes', like_controller.router() );
like_resource.load( function() { like_controller.load.apply( like_controller, arguments ) } );

/**
 * Start the app!
 */
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Listening on " + port);
});

