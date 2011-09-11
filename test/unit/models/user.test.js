var vows = require( 'vows' ),
	teardown = require( '../../test-lib' ).teardown,
	assert = require( 'assert' ),
	should = require( 'should' ),
	User = require( '../../../app/models/user.js' ),
	MongooseArray = require( 'mongoose' ).Types.Array;
  
vows.describe( 'User Model Unit Tests' ).addBatch({
	'User has been created': {
		topic: function () {
			this.callback( null, new User() );
		},
		'is a new object': function ( topic ) {
			topic.isNew.should.be.true;
		},
		'instance is of type User': function ( topic ) {
			topic.db.model( 'User' ).modelName.should.equal( 'User' );
		},
		'and all the properties should be undefined': function ( topic ) {
			should.equal( undefined, topic.get( 'email' ) );
			should.equal( undefined, topic.get( 'name' ) );
			should.equal( undefined, topic.get( 'password' ) );
			should.equal( undefined, topic.get( 'created' ) );
			should.equal( undefined, topic.get( 'updated' ) );
			
			topic.get( 'kudos' ).should.be.a( 'object' );
			topic.get( 'kudos.sent' ).should.be.an.instanceof( MongooseArray );
			topic.get( 'kudos.received' ).should.be.an.instanceof( MongooseArray );
		},
		'Users should default to 5 kudos': function ( topic ) {
			should.equal( 5, topic.get( 'kudos.have' ) );
		}
	},
	teardown: teardown
}).export( module );
