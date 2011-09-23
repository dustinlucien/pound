var async = require( 'async' ),
	mongoose = require('mongoose'),
	Like = require( './like' ),
	Comment = require( './comment' ),
	User = require('./user'),
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

Kudo.pre( 'save', function ( next ) {
	var self = this;
	
	if ( self.isNew ) {
		async.parallel({
			sender: function ( callback ) {
				User.findById( self.sender, function ( err, sender ) {
					if ( err ) {
						callback( err );
					} else {
						sender.kudos.have -= 1;
						sender.kudos.sent += 1;
						sender.save( callback );
					}
				});
			},
			recipient: function ( callback ) {
				User.findById( self.recipient, function ( err, recipient ) {
					if ( err ) {
						callback( err );
					} else {
						recipient.kudos.received += 1;
						if ( ! recipient.kudos.totals ) {
							recipient.kudos.totals = {};
						}
						var cat_total = ( recipient.kudos.totals[ self.category ] || 0 );
						recipient.kudos.totals[ self.category ] = cat_total + 1;
						recipient.markModified( 'kudos.totals' );
						recipient.save( callback );
					}
				});
			}
		}, function(err, results) {
			next();
		});
	}
});

Kudo.plugin( timestamper );

mongoose.model( 'Kudo', Kudo );

module.exports = mongoose.model( 'Kudo' );
