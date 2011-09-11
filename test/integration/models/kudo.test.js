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
			} );
		},
		'THEN the fields should be set correctly': function ( err, kudo ) {
			assert.isNull( err );
			assert.isNotNull( kudo._id );
			assert.equal( String( kudo.sender ), String( user1._id ) );
			assert.equal( String( kudo.recipient ), String( user2._id ) );
			assert.equal( String( kudo.category ), String( cats[ 0 ]._id ) );
			assert.equal( kudo.message, 'Good job' );

			assert.isNotNull( kudo.created );
			assert.isNotNull( kudo.updated );
			
			assert.isTrue( kudo.created.getTime() == kudo.updated.getTime() );
			
			User.findById( user1._id, function ( err, sender ) {
				if ( !err ) {
					assert.isTrue( user1.equals( sender ) );
					assert.isTrue( sender.kudos.sent.contains( kudo ) );

					//FIXME : move these checks to a timestamper unit test later
					assert.isTrue( user1.created.getTime(), sender.created.getTime() );
					assert.isTrue( sender.updated.getTime() > sender.created.getTime() );
					
					User.findById( user2._id, function( err, recipient ) {
						if (!err) {
							assert.isTrue( user2.equals( recipient ) );
							assert.isTrue( recipient.kudos.received.contains( kudo ) );

							//FIXME : move these checks to a timestamper unit test later
							assert.isTrue( user2.created.getTime(), recipient.created.getTime() );
							assert.isTrue( recipient.updated > recipient.created );
						}
					} );
				}
			} );
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

