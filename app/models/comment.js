var mongoose = require('mongoose'),
	ObjectId = mongoose.Schema.ObjectId,
	createdAndUpdated = require('./createdAndUpdatedPlugin');

var Comment = new mongoose.Schema({
	sender: ObjectId,
	message: String
});

Comment.plugin(createdAndUpdated);

mongoose.model( 'Comment', Comment );

module.exports = mongoose.model( 'Comment' );
