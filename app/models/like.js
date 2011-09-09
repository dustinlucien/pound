var mongoose = require('mongoose'),
	ObjectId = mongoose.Schema.ObjectId,
	timestamper = require('./timestamper');;

var Like = new mongoose.Schema({
	sender: ObjectId
});

Like.plugin(timestamper);

mongoose.model( 'Like', Like );

module.exports = mongoose.model( 'Like' );
