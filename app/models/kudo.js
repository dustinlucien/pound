var mongoose = require('mongoose'),
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

Kudo.plugin(timestamper);

Kudo.post('save', function(next) {
	User = require('./user');
	async.parallel([
		function(callback) {
			User.findById(this.sender, function(err, user) {
				if (err) {
					next(err);
				} else {
					if (user.kudos.sent.updated === user.kudos.sent.created) {
						user.kudos.sent.push(this);
						user.save(function(err) {
							callback(err, null);
						});
					}
				}
			});
		},
		function(callback) {
			User.findById(this.recipient, function(err, user) {
				if (err) {
					callback(err, null);
				} else {
					if (user.kudos.received.updated === user.kudos.received.created) {
						user.kudos.received.push(this);
						user.save(function(err) {
							callback(err, null);
						});
					}
				}
			});
		}
		], function(err, results) {
			next(err);
		}
	);
});

mongoose.model( 'Kudo', Kudo );

module.exports = mongoose.model( 'Kudo' );