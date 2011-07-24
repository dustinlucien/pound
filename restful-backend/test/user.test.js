var vows = require('vows')
  , assert = require('assert')
  , should = require('should')
  , User = require('../app/models/user.js').User;
  
vows.describe('Users').addBatch({
  'Before a User is created': {
    topic : function () { return new User },
      'has no username': function (topic) {
          assert.isNull (topic.username);
      },
      'the id is a number' : function(topic) {
        assert.isNumber(topic.id)
      },
      'but has no value' : function(topic) {
        assert.isNaN(topic.id)
      }
  }
}).export(module);