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

var db = mongoose.createConnection( 'mongodb://127.0.0.1:27017/test' ),
	User = db.model( 'User' );

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
			var cookie_str = res.headers[ 'set-cookie' ][ 0 ].split( '; ' )[ 0 ],
				response = JSON.parse( body );

			COOKIE_HEADER.Cookie = cookie_str;

			assert.equal( response.meta.code, 200 );
			assert.isNull( response.session );
		}
	},

	'WHEN I list users before authenticating': {
		topic: function () {
			api.get( 'users.json', null, this.callback );
		},
		'THEN I should get a 403': function ( err, res, body ) {
			assert.equal( res.statusCode, 403 );
		}
	}

}).addBatch({

	'WHEN I create a new User with valid data and post JSON': {
		topic: function () {
			var payload =  JSON.stringify({
				username: 'testuser',
				firstname: 'test',
				lastname: 'user',
				email: 'testuser@testdomain.com',
				password: '1234'
			});

			api.post( 'users', payload, JSON_HEADER, this.callback );
    	},
	    'THEN I should get the same User back as the response': function ( err, res, body ) {
			assert.isNull( err );
			assert.isNotNull( body );

			var response = JSON.parse( body ),
				user = response.response.user;

			user.username.should.equal( 'testuser' );
			user.firstname.should.equal( 'test' );
			user.lastname.should.equal( 'user' );
			user.email.should.equal( 'testuser@testdomain.com' );
			should.exist( user._id );
		}
	},

}).addBatch({

	'WHEN I create a new User with valid data and post POST params': {
		topic: function () {
			var callback = this.callback;
			User.remove( {}, function () {
				var payload = 'username=testuser&firstname=test&lastname=user&email=testuser@testdomain.com&password=1234';
				api.post( 'users', payload, FORM_HEADER, callback );
			});
		},
		'THEN I should get the same User back as the response': function ( err, res, body ) {
			assert.isNull( err );
			assert.isNotNull( body );
		}
	}

}).addBatch({

	'WHEN I log in': {
		topic: function () {
			var payload = 'email=testuser%40testdomain.com&password=1234',
				headers = merge( COOKIE_HEADER, FORM_HEADER );

			api.post( 'auth/login', payload, headers, this.callback );
		},
		'THEN I should get a 200 code': function ( err, res, body ) {
			var response = JSON.parse( body );
			assert.equal( response.meta.code, 200 );
		}
	}

}).addBatch({

	'WHEN I get the list users': {
		topic: function () {
			api.get( 'users', COOKIE_HEADER, this.callback );
		},
		'THEN i get back a few': function ( err, res, body ) {
			assert.isNull( err );
			assert.isNotNull( body );

			var response = JSON.parse( body );
			response.response.users.count.should.be.above( 0 );
		}
	},

	'WHEN I update a single user': {
		topic: function () {
			var callback = this.callback;

			api.get( 'users', COOKIE_HEADER, function ( err, res, body ) {
				var response = JSON.parse( body ),

				payload = JSON.stringify({
					firstname: 'test-changed',
					lastname: 'user-changed'
				}),

				headers = merge( JSON_HEADER, COOKIE_HEADER );

				api.put( 'users/' + response.response.users.items[0]._id, payload, headers, callback );
			});
		},
		'THEN I get an updated version of the user back': function ( err, res, body ) {
			assert.isNull( err );
			assert.isNotNull( body );

			var response = JSON.parse( body );
			response.response.user.firstname.should.equal( 'test-changed' );
			response.response.user.lastname.should.equal( 'user-changed' );
		},
		teardown: function () {
			db.close();
		}
	}

}).addBatch({

	'WHEN I delete all the users': {
		topic: function () {
			var callback = this.callback;

			api.get( 'users', COOKIE_HEADER, function ( err, res, body ) {
				if ( err ) {
					callback( err, res, body );
				} else {
					var response = JSON.parse( body ),
					users = response.response.users.items,
					l = users.length,
					deleted = 0;

					for ( var i = 0; i < l; i++ ) {
						user = users[i];
						api.del( 'users/' + user._id, COOKIE_HEADER, function( err, res, body ) {
							if ( err ) {
								callback( err, res, body );
							} else {
								deleted++;
								if ( l === deleted ) {
									api.get( 'users', COOKIE_HEADER, callback );
								}
							}
						});
					}
				}
			});
		},
		'THEN i get back no users from a listing call': function ( err, res, body ) {
			var response = JSON.parse( body );
			assert.equal( response.response.users.count, 0 );
		}
	}

}).export( module );

