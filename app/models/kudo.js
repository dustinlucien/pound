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

Kudo.pre( 'save', function ( next ) {
	var self = this;
	
	if ( self.isNew ) {
		async.parallel({
			sender: function ( callback ) {
				var User = self.model('User');
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
				var User = self.model('User');
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

Kudo.methods.populateResponse = function ( cb ) {
	var self = this;
	async.parallel({
		sender: function(callback) {
			var User = self.model('User');
			User.findById( self.sender, function(err, user) {
				user.populateResponse( callback );
			});
		},

		recipient: function(callback) {
			var User = self.model('User');
			User.findById( self.recipient, function(err, user) {
				user.populateResponse( callback );
			});
		},
		
		category: function(callback) {
			var KudoCategory = self.model('KudoCategory');
			KudoCategory.findById( self.category, function(err, category) {
				category.populateResponse( callback );
			});
		}
	}, function(err, results) {
		if (err) {
			cb(err, null);
		} else {
			var out = self.toObject();
			
			out.sender = results.sender;
			out.recipient = results.recipient;
			out.category = results.category;
			
			cb(null, out);	
		}
	});
}

mongoose.model( 'Kudo', Kudo );

module.exports = mongoose.model( 'Kudo' );
