var mongoose = require('mongoose'),
	ObjectId = mongoose.Schema.ObjectId,
	createdAndUpdated = require('./createdAndUpdatedPlugin');;

var KudoCategory = new mongoose.Schema({
	name: {
		type: String,
		unique: true
	},
	shoutout: String,
	description: String
});

KudoCategory.plugin(createdAndUpdated);

mongoose.model( 'KudoCategory', KudoCategory );

module.exports = mongoose.model( 'KudoCategory' );
