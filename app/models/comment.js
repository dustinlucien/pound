(function() {
  var Comment, ObjectId, mongoose;
  mongoose = require('mongoose');
  ObjectId = mongoose.Schema.ObjectId;
  Comment = new mongoose.Schema({
    id: ObjectId,
    sender: ObjectId,
    created: Date
  });
  mongoose.model('Comment', Comment);
}).call(this);
