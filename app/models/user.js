var mongoose = require( 'mongoose' ),
	ObjectId = mongoose.Schema.ObjectId,
	timestamper = require('./timestamper');;

var crypto = require( 'crypto' );
function md5 ( str ) {
	var md5Hash = crypto.createHash( 'md5' );
	md5Hash.update( str );
	return md5Hash.digest( 'hex' );
}

var User = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		validate: [
			/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
			'format'
		]
	},
	password: {
		type: String,
		required: true
	},
	kudos: {
		have: {
			type: Number,
			min: 0,
			default: 5
		},
		sent: {
			type: Number, 
			min: 0,
			default: 0
		},
		received: {
			type: Number, 
			min: 0,
			default: 0
		}
	}
});

User.plugin( timestamper );

User.static( 'encrypt_pass', function ( v ) {
	return md5( v + 'some salt 1234 ya!' );
});

// a setter for the password field--encrypts the password with a salt
User.path( 'password' ).set( function ( v ) {
	return User.statics.encrypt_pass( v );
});

mongoose.model( 'User', User );

module.exports = mongoose.model( 'User' );
