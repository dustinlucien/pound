var vows = require('vows')
  , assert = require('assert')
  , should = require('should')
  , request = require('request')
  , User = require('../../../app/models/user');

require('../../../app.js');

var test_api_uri = 'http://localhost:3000/';

var api = {
	get: function(path, callback) {
		request.get({uri:test_api_uri + path}, function (err, res, body) {
			checkResponse(err, res, body, callback);
		});
	},
	post: function(path, payload, callback) {
		request.post({uri:test_api_uri + path, body: payload, headers: {'Content-Type': 'application/json'}}, 
			function (err, res, body) {
				assert.isNotNull(payload);
				checkResponse(err, res, body, callback);
			}
		);
	},
	put: function(path, payload, callback) {
		request.put({uri:test_api_uri + path, body:payload, headers: {'Content-Type': 'application/json'}}, 
			function (err, res, body) {
				assert.isNotNull(payload);
				checkResponse(err, res, body, callback);
			}
		);
	}
};

function checkResponse(err, res, body, callback) {
	assert.isNull(err);
	assert.isNotNull(res);
	assert.equal(res.statusCode, '200');
	callback(err, res, body);
}


vows.describe('Users Api Integration Tests').addBatch({
  'WHEN I list users with no users created': {
    topic: function() {
      api.get('users.json', this.callback)
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
    	api.get('users', this.callback);
    },
    'THEN I should still get back application/json as the content type': function(err, res, body) {
    	assert.equal(res.headers['content-type'], 'application/json');
    	assert.equal(body, 'listing users');
    }
  },
  'WHEN I create a new User with valid data ': {
    topic: function() {
    	api.post('users', '{"user":{"name":"tj"}}', this.callback);
    },
    'THEN I should get the same User back as the response': function(err, res, body) {
    	
    }
  }
}).export(module);
