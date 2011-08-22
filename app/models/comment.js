var mongoose = require('mongoose'),
	ObjectId = mongoose.Schema.ObjectId;

var Comment = new mongoose.Schema({
	sender: ObjectId,
	message: String,
	created: Date
});

mongoose.model( 'Comment', Comment );

module.exports = mongoose.model( 'Comment' );
