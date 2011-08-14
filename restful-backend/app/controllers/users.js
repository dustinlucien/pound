var mongoose = require('mongoose');

//GET /users  ->  index
exports.index = function(req, res) {
  console.log('listing all existing users');
	var UserSchema = mongoose.model('User');
	UserSchema.find({}, function(err, docs) {
	  if (!err) {
	    res.send(docs);
	  } else {
	    res.send(err);
	  }
	});
};

//POST /users -> create
exports.create = function(req, res) {
  //user middleware to authenticate a user at some point
  console.log("creating a new user");
  
  var UserSchema = mongoose.model('User');
  var user = new UserSchema(req.body);
  //for now, synchronously save to mongo
  user.save(function(err, doc) {
    if (!err) {
      res.send(doc);
    } else {
      res.send(err);
    }
  });
}

//GET /users/:user -> show
exports.show = function(req, res) {
  console.log('showing user ' + req.params.user);
  var UserSchema = mongoose.model('User');
  
  if (req.params.user != null) {
    var user = UserSchema.findById(req.params.user, function(err, doc) {
      if (!err) {
        res.send(doc);
      } else {
        res.send(err);
      }
    });
  } else {
    //replace with a standard error response
    res.send('error: no user ID submitted');
  }
}

//PUT /users/:user -> update
exports.update = function(req, res) {
	console.log('updating user ' + req.params.user);
}

//DELETE /users/:user -> delete
exports.destroy = function(req, res) {
	res.send('destroying user ' + req.params.user);
}

