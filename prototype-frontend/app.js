
/**
 * Module dependencies.
 */

var express = require('express');
var io = require('socket.io');
var events = require('events');
var request = require('request');

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
var people = []

var socket = io.listen(app);
socket.on('connection', function(client){
	console.log('Client Connected');

	client.on('message', function(message){
	  console.log('Bump recieved ' + message);
	  
	  var bump = JSON.parse(message)
	  
	  if (bump.them.length <= 1 ||
	    bump.you.length <= 1) {
	    console.log("ignoring bump.")
	    return;
	  }
	  
	  var found = false;
	  for (var index in people) {
	    var person = people[index];
	    console.log("person in list : " + person.handle);
	    if (bump.them == person.handle) {
	      console.log("found an existing person");
    	  found = true;
	      person.bumps++;
    	  
	      //refactor this
	      var person_json = JSON.stringify(person);
    	  client.broadcast(person_json);
    	  client.send(person_json);

	    }
	  }
	  
	  if (!found) {
	    var twitter_profile_uri = "http://api.twitter.com/1/users/show/" + bump.them.substr(1, bump.them.length - 1) + ".json";
	    
	    console.log("profile uri: " + twitter_profile_uri);
	    request({ uri:twitter_profile_uri }, function (error, response, body) {
        if (error && response.statusCode !== 200) {
          console.log('Error when contacting twitter.com');
        }
        var data = JSON.parse(body);
        var person = {'handle':bump.them, 'profile_image_url': data['profile_image_url'], 'bumps': 1};
  	    
  	    people.push(person);
  	    
  	    //refactor this
  	    var person_json = JSON.stringify(person);
    	  client.broadcast(person_json);
    	  client.send(person_json);
      });
	  }
	});
	
	client.on('disconnect', function(){
		console.log('Client Disconnected.');
	});
});

// Routes
app.get('/', function(req, res){
  res.render('index', {
    title: 'Kudos!',
    people: people
  });
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Listening on " + port);
});