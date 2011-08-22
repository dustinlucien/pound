var mongoose = require('mongoose'),
	ObjectId = mongoose.Schema.ObjectId;

var KudoCategory = new mongoose.Schema({
	name: {
		type: String,
		unique: true
	},
	shoutout: String,
	description: String
});

mongoose.model( 'KudoCategory', KudoCategory );

module.exports = mongoose.model( 'KudoCategory' );
