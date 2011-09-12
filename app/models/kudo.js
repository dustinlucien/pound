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

	if ( this.created.getTime() ===  this.updated.getTime() ) {
		var User = require( './user' );

		async.parallel([
			function ( callback ) {
				User.findById( self.sender, function ( err, sender ) {
					if ( err ) {
						callback( err );
					} else {
						sender.kudos.sent.push( self );
						sender.save( callback );
					}
				});
			},
			function ( callback ) {
				User.findById( self.recipient, function ( err, recipient ) {
					if ( err ) {
						callback( err );
					} else {
						recipient.kudos.received.push( self );
						recipient.save( callback );
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
