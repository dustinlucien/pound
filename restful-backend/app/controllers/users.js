var mongoose = require('mongoose');
var should = require('should');

var User = require('../models/user');

/*
Move this to a more general place to use in all Controllers
*/
function formatApiResponse(res, err, docs) {
  var output = {};  
  var statusCode;
  
  if (!err) {
    if (docs == null) {
      output.response = {}
      statusCode = 200;
    } else if (docs instanceof Array) {
      output.response = {users : { count : docs.length, items : docs }};
    } else {
      output.response = { user : docs } ;
    }
    output.meta = { code : 200 };
    statusCode = 200;
  } else {
    output.error = { type : 'server', description : err };
    output.meta = { code : 500 };
    statusCode = 500;
  }
  
  res.send(JSON.stringify(output), statusCode);
}


//GET /users  ->  index
exports.index = function(req, res) {
  var UserModel = mongoose.model('User');
  UserModel.find({}, function(err, docs) {
    if (docs == null) {
      docs = [];
    }
    formatApiResponse(res, err, docs);
  });
};

//POST /users -> create
exports.create = function(req, res) {
  //user middleware to authenticate a user at some point
  var UserModel = mongoose.model('User');
  var user = new UserModel(req.body);
  //for now, synchronously save to mongo
  user.save(function(err, doc) {
    formatApiResponse(res, err, doc)
  });
}

//GET /users/:user -> show
exports.show = function(req, res) {
  should.exist(req.params.user);
  
  console.log('showing user ' + req.params.user);  
  var UserModel = mongoose.model('User');
  var user = UserModel.findById(req.params.user, function(err, doc) {
    formatApiResponse(res, err, doc);
  });
}

//PUT /users/:user -> update
exports.update = function(req, res) {
  should.exist(req.params.user);
  should.exist(req.body);

  var UserModel = mongoose.model('User');
  UserModel.findById(req.params.user, function(err, doc) {
    if (doc && !err) {
      for (var field in req.body) {
        doc.set(field, req.body[field]);
      }
      doc.save(function(err, doc) {
        formatApiResponse(res, err, doc);
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
	  doc.remove(function(err, doc) {
	    formatApiResponse(res, err, doc);
	  });
	});
}