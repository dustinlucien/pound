var vows = require( 'vows' ),
	assert = require( 'assert' ),
	should = require( 'should' ),
	request = require( 'request' ),
	mongoose = require( 'mongoose' ),
	UserModel = require( '../../../app/models/user' );
  
var test_api_uri = 'http://localhost:3000/';

var JSON_HEADER = {'Content-Type': 'application/json'},
	FORM_HEADER = {'Content-Type': 'application/x-www-form-urlencoded'},
	COOKIE_HEADER = {};

var ME = null;

function merge ( header1, header2 ) {
	var header3 = {};
	for ( key in header1 ) {
		header3[ key ] = header1[ key ];
	}
	for ( key in header2 ) {
		header3[ key ] = header2[ key ];
	}
	return header3;
}

function checkResponse( err, res, body, callback ) {
	assert.isNull(err);
	assert.isNotNull(res);
	callback(err, res, body);
}

mongoose.connect( 'mongodb://127.0.0.1:27017/test' );

var User = require( '../../../app/models/user.js' );

var api = {
	get: function(path, headers, callback) {
		assert.isNotNull(path);
		assert.isNotNull(callback);

		request.get({uri:test_api_uri + path, headers: headers}, function (err, res, body) {
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

	del: function(path, headers, callback) {
		assert.isNotNull(path);
		assert.isNotNull(callback);
		request({method:'DELETE', uri:test_api_uri + path, headers: headers}, function(err, res, body) {
			checkResponse(err, res, body, callback);
		});
	}
};


vows.describe('Users Api Integration Tests').addBatch({

	'WHEN I check session status before authenticating': {
		topic: function () {
			var callback = this.callback;
			User.remove( {}, function () {
				api.get( 'auth/session', null, callback );
			});
		},
		'THEN I should get a null session': function ( err, res, body ) {
			assert.equal( res.statusCode, 200 );

			var cookie_str = res.headers[ 'set-cookie' ][ 0 ].split( '; ' )[ 0 ],
				response = JSON.parse( body );

			COOKIE_HEADER.Cookie = cookie_str;

			assert.isNull( response.session );
		}
	},

	'WHEN I list users before authenticating': {
		topic: function () {
			api.get( 'users.json', null, this.callback );
		},
		'THEN I should get a 401': function ( err, res, body ) {
			assert.equal( res.statusCode, 401 );
		}
	}

}).addBatch({

	'WHEN I create a new User with valid data and post JSON': {
		topic: function () {
			var payload =  JSON.stringify({
				records: [{
					name: 'test user',
					email: 'testuser@testdomain.com',
					password: '1234'
				}]
			});

			api.post( 'users', payload, JSON_HEADER, this.callback );
    	},
	    'THEN I should get the same User back as the response': function ( err, res, body ) {
			var response = JSON.parse( body );

			should.exist( response.response.users );
			response.response.users.count.should.equal( 1 );

			var user = response.response.users.items[ 0 ];

			user.name.should.equal( 'test user' );
			user.email.should.equal( 'testuser@testdomain.com' );
			should.exist( user._id );

			ME = user._id;
		}
	},

/*
}).addBatch({

	'WHEN I create a new User with valid data and post POST params': {
		topic: function () {
			var callback = this.callback;
			User.remove( {}, function () {
				var payload = 'name=test%20user&email=testuser@testdomain.com&password=1234';
				api.post( 'users', payload, FORM_HEADER, callback );
			});
		},
		'THEN I should get the same User back as the response': function ( err, res, body ) {
			var response = JSON.parse( body );

			should.exist( response.response.users );
			response.response.users.count.should.equal( 1 );

			var user = response.response.users.items[ 0 ];

			user.name.should.equal( 'test user' );
			user.email.should.equal( 'testuser@testdomain.com' );
			should.exist( user._id );
		}
	}
*/
}).addBatch({

	'WHEN I log in': {
		topic: function () {
			var payload = JSON.stringify({
					email: 'testuser@testdomain.com',
					password: '1234'
				}),
				headers = merge( COOKIE_HEADER, JSON_HEADER );

			api.post( 'auth/login', payload, headers, this.callback );
		},
		'THEN I should get a 200 code': function ( err, res, body ) {
			assert.equal( res.statusCode, 200 );
		}
	}

}).addBatch({

	'WHEN I get the list of users': {
		topic: function () {
			api.get( 'users', COOKIE_HEADER, this.callback );
		},
		'THEN I get back a few': function ( err, res, body ) {
			assert.equal( res.statusCode, 200 );

			var response = JSON.parse( body );

			response.response.users.count.should.be.above( 0 );
		}
	},

	'WHEN I get the user': {
		topic: function () {
			api.get( 'users/' + ME, COOKIE_HEADER, this.callback );
		},
		'THEN the information should be correct': function ( err, res, body ) {
			assert.equal( res.statusCode, 200 );

			var response = JSON.parse( body ),
				user = response.response.users.items[ 0 ];

			assert.equal( user.name, 'test user' );
			assert.equal( user.email, 'testuser@testdomain.com' );
		}
	},

	'WHEN I update a single user': {
		topic: function () {
			var payload = JSON.stringify({
				name: 'test-changed'
			}),

			headers = merge( JSON_HEADER, COOKIE_HEADER );

			api.put( 'users/' + ME, payload, headers, this.callback );
		},
		'THEN I get an updated version of the user back': function ( err, res, body ) {
			assert.equal( res.statusCode, 200 );

			var response = JSON.parse( body );

			response.response.users.items[ 0 ].name.should.equal( 'test-changed' );
		}
	}

}).addBatch({

	'WHEN I delete my user': {
		topic: function () {
			var callback = this.callback;

			api.del( 'users/' + ME, COOKIE_HEADER, function ( err, res, body ) {
				api.get( 'users/' + ME, COOKIE_HEADER, callback );
			});
		},
		'THEN the user is gone': function ( err, res, body ) {
			assert.equal( res.statusCode, 404 );
		}
	},
	teardown: function () {
		mongoose.connections[ 0 ].close();
	}

}).export( module );
