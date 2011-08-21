var mongoose = require('mongoose'),
	ObjectId = mongoose.Schema.ObjectId;

var Like = new mongoose.Schema({
	sender: ObjectId,
	created: Date
});

mongoose.model( 'Like', Like );

module.exports = mongoose.model( 'Like' );
