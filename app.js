
/**
 * Module dependencies.
 */

var express = require('express');
var io = require('socket.io');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.dynamicHelpers({ messages: require('express-messages') });

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

//setup for socket.io
var socket = io.listen(app);
socket.on('connection', function(client){
	console.log('Client Connected');

	client.on('message', function(message){
	  console.log('Message recieved ' + message);
	  client.broadcast(message);
	  client.send(message);
	});
	
	client.on('disconnect', function(){
		console.log('Client Disconnected.');
	});
});

// Routes
app.get('/', function(req, res){
  res.render('index', {
    title: 'lbs!'
  });
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Listening on " + port);
});