var mongoose = require('mongoose'),
	ObjectId = mongoose.Schema.ObjectId,
	timestamper = require('./timestamper');

var Comment = new mongoose.Schema({
	sender: { type: ObjectId, ref: 'User' },
	kudo: { type: ObjectId, ref: 'Kudo' },
	message: String
});

Comment.plugin(timestamper);

mongoose.model( 'Comment', Comment );

module.exports = mongoose.model( 'Comment' );
