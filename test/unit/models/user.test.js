var vows = require('vows')
  , assert = require('assert')
  , should = require('should')
  , mongoose = require('mongoose')
  , MongooseArray = mongoose.Types.Array
  , MongooseNumber = mongoose.Types.Number
  , User = require('../../../app/models/user.js');
  
vows.describe('User Model Unit Tests').addBatch({
  'Before a User is created': {
    topic : function () { return mongoose.model('User') },
      'has no username': function (topic) {
        assert.isNotNull (topic.username);
      },
      'the id is a number': function(topic) {
        assert.isNotNull(topic.id);
      },
      'but has no value': function(topic) {
        assert.isNotNull(topic.id);
      }
  },
  'User has been created': {
    topic: function () {
      var model = mongoose.model('User');
      return new model();
    },
    'is a new object': function(topic) {
      topic.isNew.should.be.true;
    },
    'instance is of type User': function (topic) {
      topic.db.model('User').modelName.should.equal('User');
    },
    'and all the properties should be undefined': function (topic) {
      should.equal(undefined, topic.get('username'));
      should.equal(undefined, topic.get('firstname'));
      should.equal(undefined, topic.get('lastname'));
      
      topic.get('facebook').should.be.a('object');
      topic.get('facebook').should.eql({});
      should.equal(undefined, topic.get('facebook.username'));
      should.equal(undefined, topic.get('facebook.token'));
      should.equal(undefined, topic.get('facebook.token_secret'));
      
      topic.get('twitter').should.be.a('object');
      topic.get('twitter').should.eql({});
      should.equal(undefined, topic.get('twitter.username'));
      should.equal(undefined, topic.get('twitter.token'));
      should.equal(undefined, topic.get('twitter.token_secret'));

      topic.get('linkedin').should.be.a('object');
      topic.get('linkedin').should.eql({});
      should.equal(undefined, topic.get('linkedin.username'));
      should.equal(undefined, topic.get('linkedin.token'));
      should.equal(undefined, topic.get('linkedin.token_secret'));
      
      topic.get('kudos').should.be.a('object');
      topic.get('kudos.sent').should.be.an.instanceof(MongooseArray);
      topic.get('kudos.received').should.be.an.instanceof(MongooseArray);
    },
    'Users should default to 25 kudos': function(topic) {
      should.equal(25, topic.get('kudos.have'));
    }
  }
}).export(module);
