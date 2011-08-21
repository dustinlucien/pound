var mongoose = require('mongoose'),
	ObjectId = mongoose.Schema.ObjectId;

var KudoCategory = new mongoose.Schema({
	name: String,
	shoutout: String,
	description: String
});

mongoose.model( 'KudoCategory', KudoCategory );

module.exports = mongoose.model( 'KudoCategory' );
