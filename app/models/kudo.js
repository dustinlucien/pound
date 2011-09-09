var mongoose = require('mongoose'),
	Like = require( './like' ),
	Comment = require( './comment' ),
	ObjectId = mongoose.Schema.ObjectId;

var Kudo = new mongoose.Schema({
	message: {
		type: String,
		required: true
	},
	sender: {
		type: ObjectId,
		required: true,
	},
	recipient: {
		type: ObjectId,
		required: true
	},
	category: {
		type: ObjectId,
		required: true
	},
	likes: [ Like ],
	comments: [ Comment ],
	created: Date
});

mongoose.model( 'Kudo', Kudo );

module.exports = mongoose.model( 'Kudo' );