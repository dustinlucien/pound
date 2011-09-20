var vows = require( 'vows' ),
	assert = require( 'assert' ),
	async = require( 'async' ),
	should = require( 'should' ),
	request = require( 'request' ),
	lib = require( '../../test-lib' ),
	ensure_categories = require( '../../../app/util/ensure-categories' ),
	api = lib.api,
	merge = lib.merge,
	teardown = lib.teardown;
  
var JSON_HEADER = {'Content-Type': 'application/json'},
	FORM_HEADER = {'Content-Type': 'application/x-www-form-urlencoded'},
	COOKIE_HEADER = {};

var User = require( '../../../app/models/user' ),
	Kudo = require( '../../../app/models/kudo' ),
	KudoCategory = require( '../../../app/models/kudo-category' );

var user1, user2, user3, cats, KUDO;

function setup ( cb ) {
	ensure_categories( false, function () {
	KudoCategory.find( {}, function ( err, c ) {
		cats = c;
		User.remove( {}, function () {
		Kudo.remove( {}, function () {
			user1 = new User({
				email: 'user1@user.com',
				name: 'User 1',
				password: '1234'
			});
			user2 = new User({
				email: 'user2@user.com',
				name: 'User 2',
				password: '1234'
			});
			user3 = new User({
				email: 'user3@user.com',
				name: 'User 3',
				password: '5678'
			});

			async.parallel([
				function ( callback ) { user1.save( callback ); },
				function ( callback ) { user2.save( callback ); },
				function ( callback ) { user3.save( callback ); }
			], cb );
		});
		});
	});
	});
}

vows.describe( 'Kudos Api Integration Tests' ).addBatch({

	'WHEN I check session status before authenticating': {
		topic: function () {
			var callback = this.callback;
			setup( function () {
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

	'WHEN I list kudos before authenticating': {
		topic: function () {
			api.get( 'kudos', null, this.callback );
		},
		'THEN I should get a 401': function ( err, res, body ) {
			assert.equal( JSON.parse( body ).meta.code, 401 );
		}
	}

}).addBatch({

	'WHEN I log in': {
		topic: function () {
			var payload = JSON.stringify({
					email: 'user1@user.com',
					password: '1234'
				}),
				headers = merge( COOKIE_HEADER, JSON_HEADER );

			api.post( 'auth/login', payload, headers, this.callback );
		},
		'THEN I should get a 200 code': function ( err, res, body ) {
			assert.equal( JSON.parse( body ).meta.code, 200 );
		}
	}

}).addBatch({

	'WHEN I try to send a Kudo as another user': {
		topic: function () {
			var payload = JSON.stringify({
				records: [{
					sender: user2._id,
					recipient: user2._id,
					category: cats[ 0 ]._id,
					message: 'Good job'
				}]
			}),

			headers = merge( JSON_HEADER, COOKIE_HEADER );

			api.post( 'kudos', payload, headers, this.callback );
		},
		'THEN I should get a 403 code': function ( err, res, body ) {
			assert.equal( JSON.parse( body ).meta.code, 403 );
		}
	},

	'WHEN I try to send a Kudo to myself': {
		topic: function () {
			var payload = JSON.stringify({
				records: [{
					sender: user1._id,
					recipient: user1._id,
					category: cats[ 0 ]._id,
					message: 'Good job'
				}]
			}),

			headers = merge( JSON_HEADER, COOKIE_HEADER );

			api.post( 'kudos', payload, headers, this.callback );
		},
		'THEN I should get a 403 code': function ( err, res, body ) {
			assert.equal( JSON.parse( body ).meta.code, 403 );
		}
	},

	'WHEN I send a Kudo as myself': {
		topic: function () {
			var payload = JSON.stringify({
				records: [{
					sender: user1._id,
					recipient: user2._id,
					category: cats[ 0 ]._id,
					message: 'Good job'
				}]
			}),

			headers = merge( JSON_HEADER, COOKIE_HEADER );

			api.post( 'kudos', payload, headers, this.callback );		
		},
		'THEN I should get a 200 code': function ( err, res, body ) {
			assert.equal( JSON.parse( body ).meta.code, 200 );
		},
		'THEN I should get back the same Kudo': function ( err, res, body ) {
			var kudo = JSON.parse( body ).response.kudos.items[ 0 ];

			assert.isNotNull( kudo._id );
			assert.equal( kudo.sender._id, String( user1._id ) );
			assert.equal( kudo.recipient._id, String( user2._id ) );
			assert.equal( kudo.category._id, String( cats[ 0 ]._id ) );
			assert.equal( kudo.message, 'Good job' ); 

			KUDO = kudo._id;
		}
	}

}).addBatch({

	'WHEN I get the list of Kudos': {
		topic: function () {
			api.get( 'kudos', COOKIE_HEADER, this.callback );
		},
		'THEN I should get a 200 status code': function ( err, res, body ) {
			assert.equal( JSON.parse( body ).meta.code, 200 );
		},
		'THEN I should get a list of Kudos': function ( err, res, body ) {
			var items = JSON.parse( body ).response.kudos.items;

			assert.ok( items.length > 0 );
			assert.equal( items[ 0 ].message, 'Good job' );
		}
	},

	'WHEN I get the Kudo I created': {
		topic: function () {
			api.get( 'kudos/' + KUDO, COOKIE_HEADER, this.callback );		
		},
		'THEN I should get a 200 code': function ( err, res, body ) {
			assert.equal( JSON.parse( body ).meta.code, 200 );
		},
		'THEN I should get back the same Kudo': function ( err, res, body ) {
			var kudo = JSON.parse( body ).response.kudos.items[ 0 ];

			assert.isNotNull( kudo._id );
			assert.equal( kudo.sender._id, String( user1._id ) );
			assert.equal( kudo.recipient._id, String( user2._id ) );
			assert.equal( kudo.category._id, String( cats[ 0 ]._id ) );
			assert.equal( kudo.message, 'Good job' ); 
		}
	},

	'WHEN I list the Kudos the sender has sent': {
		topic: function() {
			api.get( 'users/' + user1._id + '/kudos/sent', COOKIE_HEADER, this.callback );
		},
		'THEN I should get back a 200 code': function ( err, res, body ) {
			assert.equal( JSON.parse( body ).meta.code, 200 );
		},
		'THEN I should get the same Kudo back': function (err, res, body ) {
			var kudo = JSON.parse( body ).response.kudos.items[ 0 ];
			assert.isNotNull( kudo._id );
			assert.equal( kudo.sender._id, String( user1._id ) );
			assert.equal( kudo.recipient._id, String( user2._id ) );
			assert.equal( kudo.category._id, String( cats[ 0 ]._id ) );
			assert.equal( kudo.message, 'Good job' ); 
		}
	},
	
	'WHEN I list the Kudos the sender has received': {
		topic: function() {
			api.get( 'users/' + user2._id + '/kudos/received', COOKIE_HEADER, this.callback );
		},
		'THEN I should get back a 200 code': function ( err, res, body ) {
			assert.equal( JSON.parse( body ).meta.code, 200 );
		},
		'THEN I should get the same Kudo back': function (err, res, body ) {
			var kudo = JSON.parse( body ).response.kudos.items[ 0 ];
			assert.isNotNull( kudo._id );
			assert.equal( kudo.sender._id, String( user1._id ) );
			assert.equal( kudo.recipient._id, String( user2._id ) );
			assert.equal( kudo.category._id, String( cats[ 0 ]._id ) );
			assert.equal( kudo.message, 'Good job' ); 
		}
	},

	'WHEN I update the Kudo I created': {
		topic: function () {
			var payload = JSON.stringify({
				message: 'Changed message'
			}),

			headers = merge( JSON_HEADER, COOKIE_HEADER );

			api.put( 'kudos/' + KUDO, payload, headers, this.callback );
		},
		'THEN I should get a 403 status code': function ( err, res, body ) {
			assert.equal( JSON.parse( body ).meta.code, 403 );
		}
	},

	'WHEN I delete the Kudo I created': {
		topic: function () {
			api.del( 'kudos/' + KUDO, COOKIE_HEADER, this.callback );
		},
		'THEN I should get a 403 status code': function ( err, res, body ) {
			assert.equal( JSON.parse( body ).meta.code, 403 );
		}
	},

	'WHEN I create a glom with an invalid recipient': {
		topic: function () {
			var headers = merge( COOKIE_HEADER, JSON_HEADER );
			var payload = JSON.stringify({
				records: [{
					message: 'blah blah',
					sender: user1._id,
					recipient: user3._id,
					category: cats[ 0 ]._id,
					parent: KUDO 
				}]
			});
			api.post( 'kudos/', payload, headers, this.callback );
		},
		'THEN I should get a 403': function ( err, res, body ) {
			body = JSON.parse( body );

			assert.equal( body.meta.code, 403 );
		}
	},

	'WHEN I create a glom': {
		topic: function () {
			var headers = merge( COOKIE_HEADER, JSON_HEADER );
			var payload = JSON.stringify({
				records: [{
					message: 'blah blah',
					sender: user1._id,
					recipient: user2._id,
					category: cats[ 0 ]._id,
					parent: KUDO 
				}]
			});
			api.post( 'kudos/', payload, headers, this.callback );
		},
		'THEN I should get a 200': function ( err, res, body ) {
			body = JSON.parse( body );

			assert.equal( body.meta.code, 200 );
		},
		'THEN I should get the glom back': function ( err, res, body ) {
			body = JSON.parse( body );
			var kudo = body.response.kudos.items[ 0 ];

			assert.isNotNull( kudo._id );
			assert.equal( kudo.message, 'blah blah' );
			assert.equal( kudo.sender._id, String( user1._id ) );
			assert.equal( kudo.recipient._id, String( user2._id ) );
			assert.equal( kudo.category._id, String( cats[ 0 ]._id ) );
			assert.equal( kudo.parent, KUDO );
		}
	}

}).addBatch({

	'WHEN I get gloms': {
		topic: function () {
			api.get( 'kudos/' + KUDO + '/gloms', COOKIE_HEADER, this.callback );
		},
		'THEN I should get a 200': function ( err, res, body ) {
			body = JSON.parse( body );

			assert.equal( body.meta.code, 200 );
		},
		'THEN I should get the correct data': function ( err, res, body ) {
			body = JSON.parse( body );

			assert.equal( body.response.kudos.items.length, 1 );

			var kudo = body.response.kudos.items[ 0 ];

			assert.equal( kudo.message, 'blah blah' );
			assert.equal( kudo.sender._id, String( user1._id ) );
			assert.equal( kudo.recipient._id, String( user2._id ) );
			assert.equal( kudo.category._id, String( cats[ 0 ]._id ) );
			assert.equal( kudo.parent, KUDO );
		}
	},

	teardown: teardown

}).export( module );

