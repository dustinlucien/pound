var mongoose = require('mongoose'),
	Like = require( './like' ),
	Comment = require( './comment' ),
	ObjectId = mongoose.Schema.ObjectId;

var Kudo = new mongoose.Schema({
	message: String,
	sender: ObjectId,
	recipient: ObjectId,
	category: ObjectId,
	likes: [ Like ],
	comments: [ Comment ],
	created: Date
});

mongoose.model( 'Kudo', Kudo );

module.exports = mongoose.model( 'Kudo' );
