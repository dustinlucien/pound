var mongoose = require('mongoose');
var should = require('should');

var User = require('../models/user');

//GET /users  ->  index
exports.index = function(req, res) {
	var UserModel = mongoose.model('User');
	UserModel.find({}, function(err, docs) {
	  if (!err) {
	    var output = '';
	    for (var doc in docs) {
	      output += doc.toJSON();
	    }
	    res.send(output);
	  } else {
	    res.send(err);
	  }
	});
};

//POST /users -> create
exports.create = function(req, res) {
  //user middleware to authenticate a user at some point
  var UserModel = mongoose.model('User');
  var user = new UserModel(req.body);
  //for now, synchronously save to mongo
  user.save(function(err, doc) {
    if (!err) {
      res.send(doc.toJSON());
    } else {
      res.send(err);
    }
  });
}

//GET /users/:user -> show
exports.show = function(req, res) {
  console.log('showing user ' + req.params.user);
  should.exist(req.params.user);
  
  var UserModel = mongoose.model('User');
  var user = UserModel.findById(req.params.user, function(err, doc) {
    if (!err) {
      res.send(doc.toJSON());
    } else {
      res.send(err);
    }
  });
}

//PUT /users/:user -> update
exports.update = function(req, res) {
	console.log('updating user ' + req.params.user);
	should.exist(req.params.user);
	
	var UserModel = mongoose.model('User');

  UserModel.findById(req.params.user, function(err, doc) {
    if (!err) {
      //validation?
      doc.update(body, function(err, doc) {
        if (!err) {
          res.send(doc.toJSON());
        } else {
          res.send(err);
        }
      });
    } else {
      res.send(err);
    }
  })
}

//DELETE /users/:user -> delete
exports.destroy = function(req, res) {
	res.send('destroying user ' + req.params.user);
	should.exist(req.params.user);
	
	var UserModel = mongoose.model('User');
	UserModel.findById(req.params.user, function(err, doc) {
	  doc.remove(function() {
	    res.send('');
	  });
	});
}

