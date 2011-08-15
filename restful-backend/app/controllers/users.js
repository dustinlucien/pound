var mongoose = require('mongoose');
var should = require('should');

var User = require('../models/user');

//GET /users  ->  index
exports.index = function(req, res) {
  var UserModel = mongoose.model('User');
  UserModel.find({}, function(err, docs) {
    if (!err) {
      res.send(JSON.stringify(docs));
    } else {
      res.send(JSON.stringify(err));
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
      res.send(JSON.stringify(doc));
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
      res.send(JSON.stringify(doc));
    } else {
      res.send(err);
    }
  });
}

//PUT /users/:user -> update
//INCOMPLETE!
exports.update = function(req, res) {
  should.exist(req.params.user);
  should.exist(req.body);

  var UserModel = mongoose.model('User');
  UserModel.findById(req.params.user, function(err, doc) {
    if (doc && !err) {
      for (var field in req.body) {
        console.log('field updating : ' + field);
        doc.set(field, req.body[field]);
      }
      doc.save(function(err, doc) {
        if (!err && doc) {
          res.send(doc);
        }
      });
    }
  });
}

//DELETE /users/:user -> delete
exports.destroy = function(req, res) {
	should.exist(req.params.user);
  console.log('destroying user ' + req.params.user);
	
	var UserModel = mongoose.model('User');
	UserModel.findById(req.params.user, function(err, doc) {
	  doc.remove(function() {
	    res.send(doc);
	  });
	});
}

