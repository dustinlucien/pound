var mongoose = require('mongoose'),
	ObjectId = mongoose.Schema.ObjectId;

var Comment = new mongoose.Schema({
	sender: ObjectId,
	message: String,
	created: { type: Date, default: Date.now },
	updated: Date
});

Comment.pre('save', function(next) {
	if (this.updated == undefined) {
		this.updated = this.created;
	} else {
		this.updated = Date.now;
	}
	next();
});

mongoose.model( 'Comment', Comment );

module.exports = mongoose.model( 'Comment' );
