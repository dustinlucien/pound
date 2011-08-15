/**
 * Dependencies
 */

var mongoose = require('mongoose'),
	should = require('should'),
	User = require('../models/user'),
	UserModel = mongoose.model( 'User' );

/**
 * Class def
 */
function UserController () {
	// no members to set
}

// extend the GenericController class
var GenericController = require( './generic.js' );
UserController.prototype.__proto__ = GenericController.prototype;

// export the UserController class
module.exports = UserController;

/**
 * Class methods
 */

//GET /users  ->  index
UserController.prototype.index = function(req, res) {
  var self = this;

  UserModel.find({}, function(err, docs) {
    if (docs == null) {
      docs = [];
    }
    self._formatApiResponse(res, err, docs);
  });
};

//POST /users -> create
UserController.prototype.create = function(req, res) {
  //user middleware to authenticate a user at some point
  var self = this,
      user = new UserModel(req.body);

  //for now, synchronously save to mongo
  user.save(function(err, doc) {
    self._formatApiResponse(res, err, doc)
  });
};

//GET /users/:user -> show
UserController.prototype.show = function(req, res) {
  should.exist(req.params.user);
  console.log('showing user ' + req.params.user);  

  var self = this;
  UserModel.findById(req.params.user, function(err, doc) {
    self._formatApiResponse(res, err, doc);
  });
};

//PUT /users/:user -> update
UserController.prototype.update = function(req, res) {
  should.exist(req.params.user);
  should.exist(req.body);

  var self = this;
  UserModel.findById(req.params.user, function(err, doc) {
    if (doc && !err) {
      for (var field in req.body) {
        doc.set(field, req.body[field]);
      }
      doc.save(function(err, doc) {
        self._formatApiResponse(res, err, doc);
      });
    }
  });
};

//DELETE /users/:user -> delete
UserController.prototype.destroy = function(req, res) {
  should.exist(req.params.user);
  console.log('destroying user ' + req.params.user);

  var self = this;
  UserModel.findById(req.params.user, function(err, doc) {
    doc.remove(function(err, doc) {
      self._formatApiResponse(res, err, doc);
    });
  });
};

