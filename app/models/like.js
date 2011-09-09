var mongoose = require('mongoose'),
	ObjectId = mongoose.Schema.ObjectId;

var Like = new mongoose.Schema({
	sender: ObjectId,
	created: { type:Date, default: Date.now },
	updated: Date
});

Like.pre('save', function(next) {
	if (this.updated == undefined) {
		this.updated = this.created;
	} else {
		this.updated = Date.now;
	}
	next();
});

mongoose.model( 'Like', Like );

module.exports = mongoose.model( 'Like' );
