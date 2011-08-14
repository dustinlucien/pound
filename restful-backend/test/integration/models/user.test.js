var vows = require('vows')
  , assert = require('assert')
  , should = require('should')
  , mongoose = require('mongoose')
  , MongooseArray = mongoose.Types.Array
  , MongooseNumber = mongoose.Types.Number
  , User = require('../../../app/models/user.js');
  
function setup(callback) {
  var db = mongoose.createConnection('mongodb://testing_user:kud05@dbh36.mongolab.com:27367/testing');

  var User = db.model('User');

  User.remove({}, function(){
    callback(User);
  });

  return db;
}

function setupNewUser(model) {
  model.email = 'test@test.com';
  model.username = 'testuser';
  model.firstname = 'test';
  model.lastname = 'user';
  model.facebook.username = 'test.user@gmail.com';
  model.twitter.username = 'testuser';
  return model;
}

vows.describe('User Model Integration Tests').addBatch({
  'WHEN I create a new user with valid data ': {
    topic: function() {
      var callback = this.callback;

      this.db = setup(function(User) {
        var user = new User();
        
        user = setupNewUser(user);
        
        user.save(callback);
      });
    },
    'THEN it should set the created time stamp': function(err, user) {
      assert.equal(err, null);
      assert.notEqual(user._id, null);
    },
    teardown: function() {
      this.db.close();
    }
  }
}).export(module);
