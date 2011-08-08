var mongoose = require('mongoose');

//GET /users  ->  index
exports.index = function(req, res) {
	res.send('listing users');
};

//POST /users -> create
exports.create = function(req, res) {
  //user middleware to authenticate a user at some point
  
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
	res.send('showing user ' + req.params.user);
}

//PUT /users/:user -> update
exports.update = function(req, res) {
	res.send('updating user ' + req.params.user);
}

//DELETE /users/:user -> delete
exports.destroy = function(req, res) {
	res.send('destroying user ' + req.params.user);
}

