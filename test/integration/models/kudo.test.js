var vows = require( 'vows' ),
	assert = require( 'assert' ),
	ensure_categories = require( '../../../app/util/ensure-categories' ),
	lib = require( '../../test-lib' ),
	teardown = lib.teardown,
	Kudo = require('../../../app/models/kudo.js'),
	User = require('../../../app/models/user.js'),
	KudoCategory = require('../../../app/models/kudo-category.js');

var user1, user2, cats;

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
				email: 'user1@user.com',
				name: 'User 1',
				password: '1234'
			});
			user1.save( function () {
				user2.save( cb );
			});
		});
		});
	});
	});
}

vows.describe( 'Kudo Model Integration Tests' ).addBatch({

	'WHEN I create a new Kudo with valid data': {
		topic: function () {
			var callback = this.callback;
			setup( function () {
				var kudo = new Kudo();
				kudo.sender = user1._id;
				kudo.recipient = user2._id;
				kudo.category = cats[ 0 ]._id;
				kudo.message = 'Good job';
				kudo.save( callback );
			});
		},
		'THEN the fields should be set correctly': function ( err, kudo ) {
			assert.isNull( err );
			assert.isNotNull( kudo._id );
			assert.equal( String( kudo.sender ), String( user1._id ) );
			assert.equal( String( kudo.recipient ), String( user2._id ) );
			assert.equal( String( kudo.category ), String( cats[ 0 ]._id ) );
			assert.equal( kudo.message, 'Good job' );
		}
	}

}).addBatch({

	'WHEN I create a new Kudo with invalid data': {
		topic: function () {
			var kudo = new Kudo();
			kudo.save( this.callback );
		},
		'THEN there should be validation errors': function ( err, kudo ) {
			assert.isNotNull( err );
			assert.equal( kudo, undefined );
		}
	},

	teardown: teardown

}).export( module );

