var mongoose = require( 'mongoose' ),
		async = require( 'async' ),
		ObjectId = mongoose.Schema.ObjectId,
		timestamper = require( './timestamper' );

var Like = new mongoose.Schema({
	sender: { type: ObjectId, ref: 'User' },
	kudo: { type: ObjectId, ref: 'Kudo' }
});

Like.plugin(timestamper);

Like.methods.populateResponse = function( cb ) {
	var self = this;
	async.parallel({
		user: function( callback ) {
			var User = self.model('User');
			User.findById( self.sender, function( err, user ) {
				if (err) {
					callback(err);
				} else {
					user.populateResponse( callback );
				}
			} );
		},
		kudo: function( callback ) {
			var Kudo = self.model( 'Kudo' );
			Kudo.findById( self.kudo, function ( err, kudo  ) {
				if ( err ) {
					callback( err );
				} else {
					kudo.populateResponse( callback );
				}
			});
		}
	}, function( err, results ) {
		if ( err ) {
			cb( err, null );
		} else {
			var out = self.toObject();

			delete out.created;
			delete out.updated;

			out.user = results.user;
			out.kudo = results.kudo;

			cb( null, out );
		}
	});
};

mongoose.model( 'Like', Like );

module.exports = mongoose.model( 'Like' );
