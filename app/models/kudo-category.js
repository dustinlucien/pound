var mongoose = require('mongoose'),
	ObjectId = mongoose.Schema.ObjectId;

var KudoCategory = new mongoose.Schema({
	name: {
		type: String,
		unique: true
	},
	shoutout: String,
	description: String,
	created: { type: Date, default: Date.now },
	updated: Date
});

KudoCategory.pre('save', function(next) {
	if (this.updated == undefined) {
		this.updated = this.created;
	} else {
		this.updated = Date.now;
	}
	next();
});

mongoose.model( 'KudoCategory', KudoCategory );

module.exports = mongoose.model( 'KudoCategory' );
