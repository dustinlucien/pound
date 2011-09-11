var async = require( 'async' ),
	mongoose = require( 'mongoose' );

var User = require( '../../app/models/user' ),
	Kudo = require( '../../app/models/kudo' );

var //mongo_uri = exports.mongo_uri = 'mongo://127.0.0.1:27017/test';
	mongo_uri = exports.mongo_uri = 'mongodb://testing_user:kud05@dbh30.mongolab.com:27307/development';

mongoose.connect( mongo_uri );

async.parallel({
	user: function ( callback ) {
		User.remove( {}, callback );
	},
	kudo: function ( callback ) {
		Kudo.remove( {}, callback );
	}
}, function ( err, result ) {
	mongoose.connections[ 0 ].close();
	console.log( 'done' );
});

