
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

// general config
app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.cookieParser());
	app.use(express.session({store: new RedisStore, secret: 'mmmm javascript'}));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(__dirname + '/public'));
	app.use(AuthMiddleware);
	app.use(app.router);
});

// development config
app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	console.log('connecting to mongoose for development');
	mongoose.connect('mongodb://testing_user:kud05@dbh30.mongolab.com:27307/development');
	//mongoose.connect('mongodb://localhost:27017/test');
});

// production config
app.configure('production', function(){
	app.use(express.errorHandler());
	console.log('connecting to mongoose for production');
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

