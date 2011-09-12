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
						sender.sent.push( self._id );
						sender.save( callback );
					}
				});
			},
			function ( callback ) {
				User.findById( self.recipient, function ( err, recipient ) {
					if ( err ) {
						callback( err );
					} else {
						recipient.received.push( self._id );
						recipient.save( callback );
					}
				});
			}
			]);
	}
});

Kudo.plugin( timestamper );

mongoose.model( 'Kudo', Kudo );

module.exports = mongoose.model( 'Kudo' );
