var vows = require( 'vows' ),
	async = require( 'async' ),
	assert = require( 'assert' ),
	ensure_categories = require( '../../../app/util/ensure-categories' ),
	lib = require( '../../test-lib' ),
	teardown = lib.teardown,

	Kudo = require('../../../app/models/kudo.js'),
	User = require('../../../app/models/user.js'),
	KudoCategory = require('../../../app/models/kudo-category.js');

var user1, user2, cats, created_id;

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
				kudo.save( function( err, kudo ) {
					created_id = kudo._id;
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
	},

	'WHEN I create a new Kudo with invalid data': {
		topic: function () {
			var bad_kudo = new Kudo();
			bad_kudo.save( this.callback );
		},
		'THEN there should be validation errors': function ( err, bad_kudo ) {
			assert.isNotNull( err );
			assert.equal( bad_kudo, undefined );
		}
	}

}).addBatch({

	'WHEN I add a glom Kudo to an existing Kudo': {
		topic: function () {
			var self = this;

			async.parallel({
				glom: function ( callback ) {
					var glom = new Kudo();

					glom.sender = user1._id;
					glom.recipient = user2._id;
					glom.category = cats[ 0 ]._id;
					glom.message = 'Good job again!';

					glom.save( callback );
				},
				original: function ( callback ) {
					var kudo = new Kudo();
					kudo.message = 'Good job again!';
					kudo.recipient = user1._id;
					kudo.sender = user2._id;
					kudo.category = cats[ 0 ]._id;

					kudo.save( callback );
				}
			}, function ( err, results ) {
				results.original.message = 'new message';
				results.original.save( function () {
					// Still not saving
					console.log( 'It saved!' );
				});
			});

/*
			glom.save( function ( err, glom ) {
				Kudo.findById( created_id, function ( err, kudo ) {
					kudo.gloms.push( glom._id );

					kudo.save( function ( err, kudo ) {
						// Why isn't this saving?
						console.log( 'It saved!' );
					});
				});
			});
*/
		},
		'THEN the fields should be set correctly': function ( err, kudo ) {
			assert.equal( kudo.gloms.length, 1 );
		}
	},

	teardown: teardown

}).export( module );

