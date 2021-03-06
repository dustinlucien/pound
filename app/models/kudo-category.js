var mongoose = require('mongoose'),
	ObjectId = mongoose.Schema.ObjectId,
	timestamper = require('./timestamper');;

var KudoCategory = new mongoose.Schema({
	name: {
		type: String,
		unique: true
	},
	shoutout: String,
	description: String
});

KudoCategory.plugin(timestamper);

KudoCategory.methods.populateResponse = function ( cb ) {
	var out = this.toObject();
	
	delete out.created;
	delete out.updated;
	
	cb( null, this.toObject() );
}

mongoose.model( 'KudoCategory', KudoCategory );

module.exports = mongoose.model( 'KudoCategory' );
