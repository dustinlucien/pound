(function() {

  var crypto = require( 'crypto' );
  function md5 ( str ) {
    var md5Hash = crypto.createHash( 'md5' );
    md5Hash.update( str );
    return md5Hash.digest( 'hex' );
  }

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
    password: String,

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

  User.static( 'encrypt_pass', function ( v ) {
    return md5( v + 'some salt' );
  });

  // a setter for the password field--encrypts the password with a salt
  User.path('password').set(function ( v ) {
    return User.statics.encrypt_pass( v );
  });

  User.post('save', function(doc) {
    console.log('just saved a user');
    return console.log('the user is brand new');
  });

  User.post('update', function(doc) {
    console.log('just updated a user');
    return console.log('the user already existed');
  });

  mongoose.model('User', User);

}).call(this);
