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
				email: 'user2@user.com',
				name: 'User 2',
				password: '3456'
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
				kudo.save( function( err ) {
					assert.isNull(err);
					User.findById( user1, function ( err, sender ) {
						assert.isNull(err);
						User.findById( user2, function( err, recipient ) {
							assert.isNull(err);
							callback( null, { kudo: kudo, sender: sender, recipient: recipient } );
						} );
					} );
				} );
			} );
		},
		'THEN the fields should be set correctly': function ( err, results ) {
			assert.isNull( err );
			assert.isNotNull( results.kudo._id );
			assert.equal( String( results.kudo.sender ), String( user1._id ) );
			assert.equal( String( results.kudo.recipient ), String( user2._id ) );
			assert.equal( String( results.kudo.category ), String( cats[ 0 ]._id ) );
			assert.equal( results.kudo.message, 'Good job' );

			assert.isNotNull( results.kudo.created );
			assert.isNotNull( results.kudo.updated );
			
			assert.isTrue( results.kudo.created.getTime() === results.kudo.updated.getTime() );
		},
		'AND the Users involved should have correct kudos counts': function ( err, results ) {			
			assert.deepEqual( user1._id, results.sender._id );
			assert.equal( results.sender.kudos.sent, 1 );
			assert.deepEqual( user2._id, results.recipient._id );
			assert.equal( results.recipient.kudos.received, 1 );
			assert.deepEqual( results.recipient.kudos.totals[ cats[ 0 ]._id ], 1 );
		},
		'AND the created and updated times should be properly set': function( err, results ) {
			//FIXME : move these checks to a timestamper unit test late
			assert.isTrue( user1.created.getTime() === results.sender.created.getTime() );
			assert.isTrue( results.sender.updated.getTime() > results.sender.created.getTime() );

			//FIXME : move these checks to a timestamper unit test later
			assert.isTrue( user2.created.getTime() === results.recipient.created.getTime() );
			assert.isTrue( results.recipient.updated.getTime() > results.recipient.created.getTime() );
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

