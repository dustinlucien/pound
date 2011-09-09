var mongoose = require('mongoose'),
	Like = require( './like' ),
	Comment = require( './comment' ),
	ObjectId = mongoose.Schema.ObjectId;

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
	comments: [ Comment ],
	created: Date
});

Kudo.post('save', function(next) {
	User = require('./user');
	async.parallel([
		function(callback) {
			User.findById(this.sender, function(err, user) {
				if (err) {
					next(err);
				} else {
					if (user.kudos.sent.indexOf(this) === -1) {
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
					if (user.kudos.received.indexOf(this) === -1) {
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