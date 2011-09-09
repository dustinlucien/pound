var mongoose = require('mongoose'),
	ObjectId = mongoose.Schema.ObjectId,
	createdAndUpdated = require('./createdAndUpdatedPlugin');;

var Like = new mongoose.Schema({
	sender: ObjectId
});

Like.plugin(createdAndUpdated);

mongoose.model( 'Like', Like );

module.exports = mongoose.model( 'Like' );
