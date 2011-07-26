var vows = require('vows')
  , assert = require('assert')
  , should = require('should')
  , request = require('request');

vows.describe('Users Api Integration Tests').addBatch({
  'WHEN I list users with no users created': {
    topic: function() {
      var callback = this.callback;

			request.get({uri:'http://localhost:3000/users.json'}, function (err, res, body) {
				assert.isNull(err);
				assert.isNotNull(res);
				assert.equal(res.statusCode, '200');
				
				callback(err, res, body);
			});
    },
    'THEN I should get nothing as a response': function(err, res, body) {
    	assert.isNotNull(body);
    },
    'AND the content-type should be application/json': function(err, res, body) {
    	assert.equal(res.headers['content-type'], 'application/json');
    }
  },
  'WHEN I list users with no format suffix': {
    topic: function() {
      var callback = this.callback;

			request.get({uri:'http://localhost:3000/users'}, callback);
    },
    'THEN I should still get back application/json as the content type': function(err, res, body) {
    	assert.equal(res.headers['content-type'], 'application/json');
    }
  },
  'WHEN I create a new User with valid data ': {
    topic: function() {
      var callback = this.callback;

			request.post({uri:'http://localhost:3000/users'}, callback);
    },
    'THEN I should get the same User back as the response': function(err, res, body) {
    	assert.isNull(err);
    	assert.isNotNull(res);
    	assert.isNotNull(body);
    	console.log(body);
    }
  }
}).export(module);
  
