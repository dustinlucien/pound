(function() {
  var Like, ObjectId, mongoose;
  mongoose = require('mongoose');
  ObjectId = mongoose.Schema.ObjectId;
  Like = new mongoose.Schema({
    id: ObjectId,
    sender: ObjectId,
    created: Date,
    test: String
  });
  mongoose.model('Like', Like);
}).call(this);
