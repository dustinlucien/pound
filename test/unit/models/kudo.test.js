var vows = require( 'vows' ),
	assert = require( 'assert' ),
	should = require( 'should' ),
	Kudo = require( '../../../app/models/kudo.js' ),
	MongooseArray = require( 'mongoose' ).Types.Array;
  
vows.describe( 'Kudo Model Unit Tests' ).addBatch({
	'Kudo has been created': {
		topic: function () {
			this.callback( null, new Kudo() );
		},
		'is a new object': function ( topic ) {
			topic.isNew.should.be.true;
		},
		'instance is of type Kudo': function ( topic ) {
			topic.db.model( 'Kudo' ).modelName.should.equal( 'Kudo' );
		},
		'and all the properties should be undefined': function ( topic ) {
			should.equal( undefined, topic.get( 'message' ) );
			should.equal( undefined, topic.get( 'sender' ) );
			should.equal( undefined, topic.get( 'recipient' ) );
			should.equal( undefined, topic.get( 'category' ) );
			should.equal( undefined, topic.get( 'created' ) );
			should.equal( undefined, topic.get( 'updated' ) );
			
			topic.get( 'comments' ).should.be.an.instanceof( MongooseArray );
			topic.get( 'likes' ).should.be.an.instanceof( MongooseArray );
		}
	}
}).export( module );
