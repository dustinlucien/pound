var async = require( 'async' ),
	mongoose = require('mongoose'),
	Like = require( './like' ),
	Comment = require( './comment' ),
	ObjectId = mongoose.Schema.ObjectId,
	timestamper = require('./timestamper');

var Kudo = new mongoose.Schema({
	message: {
		type: String,
		required: true
	},
	sender: {
		type: ObjectId,
		required: true,
	},
	recipient: {
		type: ObjectId,
		required: true
	},
	category: {
		type: ObjectId,
		required: true
	},
	likes: [ Like ],
	comments: [ Comment ]
});

Kudo.post( 'save', function ( next ) {
	var self = this;

	if ( this.updated === this.created ) {
		var User = require( './user' );

		async.parallel([
			function ( callback ) {
				User.findById( self.sender, function ( err, user ) {
					if ( err ) {
						callback( err );
					} else {
						user.kudos.sent.push( self );
						user.save( callback );
					}
				});
			},
			function ( callback ) {
				User.findById( self.recipient, function ( err, user ) {
					if ( err ) {
						callback( err );
					} else {
						user.kudos.received.push( self );
						user.save( callback );
					}
				});
			}
			], function ( err, results ) {
				next( err );
			}
		);
	}
});

Kudo.plugin( timestamper );

mongoose.model( 'Kudo', Kudo );

module.exports = mongoose.model( 'Kudo' );
