(function() {
  var Kudo, Like, ObjectId, User, mongoose;
  mongoose = require('mongoose');
  Kudo = require('./kudo');
  Like = require('./like');
  ObjectId = mongoose.Schema.ObjectId;
  User = new mongoose.Schema({
    id: ObjectId,
    username: String,
    firstname: String,
    lastname: String,
    email: String,
    facebook: {
      username: String,
      token: String,
      token_secret: String
    },
    twitter: {
      username: String,
      token: String,
      token_secret: String
    },
    linkedin: {
      username: String,
      token: String,
      token_secret: String
    },
    kudos: {
      have: {
        type: Number,
        min: 0,
        "default": 25
      },
      sent: [Kudo],
      received: [Kudo]
    }
  });
  mongoose.model('User', User);
}).call(this);
