var vows = require('vows')
  , assert = require('assert')
  , should = require('should')
  , request = require('request')
  , User = require('../../../app/models/user');
  
var test_api_uri = 'http://localhost:3000/';

var JSON_HEADER = {'Content-Type': 'application/json'};
var FORM_HEADER = {'Content-Type': 'application/x-www-form-urlencoded'};

var api = {
	get: function(path, callback) {
	  assert.isNotNull(path);
    assert.isNotNull(callback);
		request.get({uri:test_api_uri + path}, function (err, res, body) {
			checkResponse(err, res, body, callback);
		});
	},
	post: function(path, payload, headers, callback) {
	  assert.isNotNull(path);
	  assert.isNotNull(payload);
    assert.isNotNull(callback);
		request.post({uri:test_api_uri + path, body: payload, headers: headers}, function (err, res, body) {
			checkResponse(err, res, body, callback);
		});
	},
	put: function(path, payload, headers, callback) {
	  assert.isNotNull(path);
	  assert.isNotNull(payload);
    assert.isNotNull(callback);

		request({method:'PUT', uri:test_api_uri + path, body: payload, headers: headers}, function (err, res, body) {
			checkResponse(err, res, body, callback);
		});
	},
	del: function(path, callback) {
	  assert.isNotNull(path);
    assert.isNotNull(callback);
	  request({method:'DELETE', uri:test_api_uri + path}, function(err, res, body) {
	    checkResponse(err, res, body, callback);
	  });
	}
};

function checkResponse(err, res, body, callback) {
	assert.isNull(err);
	assert.isNotNull(res);
	callback(err, res, body);
}


vows.describe('Users Api Integration Tests').addBatch({
  'WHEN I list users with no users created': {
    topic: function() {
      api.get('users.json', this.callback)
    },
    'THEN I should get nothing as a response': function(err, res, body) {
    	assert.isNotNull(body);
    	var response = JSON.parse(body);
    	
    	should.exist(response);
    	should.exist(response.response);
    	should.exist(response.response.users);
    },
    'AND the content-type should be application/json': function(err, res, body) {
    	assert.match(res.headers['content-type'], /application\/json/);
    }
  },
  'WHEN I list users with no format suffix': {
    topic: function() {
    	api.get('users', this.callback);
    },
    'THEN I should still get back application/json as the content type': function(err, res, body) {
    	assert.isNull(err);
    	assert.isNotNull(body);
    	assert.match(res.headers['content-type'], /application\/json/);
    	body.length.should.be.above(0);
    }
  }

}).addBatch({

  'WHEN I create a new User with valid data and post JSON': {
    topic: function() {
      var payload =  JSON.stringify({username:'testuser', firstname:'test', lastname:'user', email:'testuser@testdomain.com'});
    	api.post('users', payload, JSON_HEADER, this.callback);
    },
    'THEN I should get the same User back as the response': function(err, res, body) {
    	assert.isNull(err);
    	assert.isNotNull(body);
    	
    	var response = JSON.parse(body);
    	var user = response.response.user;
    	user.username.should.equal('testuser');
    	user.firstname.should.equal('test');
    	user.lastname.should.equal('user');
    	user.email.should.equal('testuser@testdomain.com');
    	should.exist(user._id);
    }
  },
  'WHEN I create a new User with valid data and post POST params': {
    topic: function() {
      var payload = 'username=testuser&firstname=test&lastname=user&email=testuser@testdomain.com';
    	api.post('users', payload, FORM_HEADER, this.callback);
    },
    'THEN I should get the same User back as the response': function(err, res, body) {
    	assert.isNull(err);
    	assert.isNotNull(body);
    }
  }

}).addBatch({

  'WHEN I get the list users':{
    topic: function() {
      api.get('users', this.callback);
    },
    'THEN i get back a few': function(err, res, body) {
      assert.isNull(err);
    	assert.isNotNull(body);
    	
    	var response = JSON.parse(body);
    	
    	response.response.users.count.should.be.above(0);
    }
  },
  'WHEN I update a single user': {
    topic: function() {
      var callback = this.callback;
      
      api.get('users', function(err, res, body) {
        var response = JSON.parse(body);
        var payload = JSON.stringify({firstname:'test-changed', lastname:'user-changed'});
        api.put('users/' + response.response.users.items[0]._id, payload, JSON_HEADER, callback);
      });
    },
    'THEN I get an updated version of the user back': function(err, res, body) {
      assert.isNull(err);
      assert.isNotNull(body);
      
      var response = JSON.parse(body);
      response.response.user.firstname.should.equal('test-changed');
      response.response.user.lastname.should.equal('user-changed');
    }
  }

}).addBatch({

  'WHEN I delete all the users': {
    topic: function() {
      var callback = this.callback;
      
      api.get('users', function(err, res, body) {
        if (err) {
          callback(err, res, body);
        } else {
          var response = JSON.parse(body),
              users = response.response.users.items,
              l = users.length, deleted = 0;
          
          for (var i = 0; i < users.length; i++) {
            user = users[i];
            api.del('users/' + user._id, function(err, res, body) {
              if (err) {
                callback(err, res, body);
              } else {
                deleted++;
                if ( l === deleted ) {
                  api.get('users', callback);
                }
              }
            });
          }
        }
      });
    },
    'THEN i get back no users from a listing call': function(err, res, body) {
      console.log('returned from post delete');
    }
  }
}).export(module);
