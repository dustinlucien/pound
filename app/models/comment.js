var mongoose = require('mongoose'),
	ObjectId = mongoose.Schema.ObjectId;

var Comment = new mongoose.Schema({
	message: String,
	sender: ObjectId,
	created: Date
});

mongoose.model( 'Comment', Comment );

module.exports = mongoose.model( 'Comment' );
