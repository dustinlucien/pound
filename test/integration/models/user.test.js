var vows = require( 'vows' ),
	assert = require( 'assert' ),
	lib = require( '../../test-lib' ),
	teardown = lib.teardown,
	User = require('../../../app/models/user.js');

vows.describe( 'User Model Integration Tests' ).addBatch({

	'WHEN I create a new user with valid data': {
		topic: function () {
			var callback = this.callback;
			User.remove( {}, function () {
				var user = new User();
				user.email = 'test@test.com';
				user.name = 'test user';
				user.password = '1234';
				user.save( callback );
			});
		},
		'THEN the fields should be set correctly': function ( err, user ) {
			assert.isNull( err );
			assert.isNotNull( user._id );
			assert.notEqual( user.password, '1234' );
			assert.isNotNull( user.created );
			assert.isNotNull( user.updated );
			assert.deepEqual( user.created, user.updated );
		}
	}

}).addBatch({

	'WHEN I create a new user with invalid data': {
		topic: function () {
			var user = new User();
			user.email = 'whats an email?';
			user.name = '';
			user.password = '';
			user.save( this.callback );
		},
		'THEN there should be validation errors': function ( err, user ) {
			assert.isNotNull( err );
			assert.equal( user, undefined );
		}
	},

	teardown: teardown

}).export( module );

