var async = require( 'async' ),
		mongoose = require( 'mongoose' );

var User = require( '../../app/models/user' ),
		Kudo = require( '../../app/models/kudo' ),
		Like = require( '../../app/models/like' ),
		Comment = require( '../../app/models/comment' );

var //mongo_uri = exports.mongo_uri = 'mongo://127.0.0.1:27017/test';
	mongo_uri = exports.mongo_uri = 'mongodb://testing_user:kud05@dbh30.mongolab.com:27307/development';
	//mongo_uri = exports.mongo_uri = 'mongodb://testing_user:kud05@dbh30.mongolab.com:27157/heroku_app563134';

mongoose.connect( mongo_uri );

async.parallel({
	user: function ( callback ) {
		User.remove( {}, callback );
	},
	kudo: function ( callback ) {
		Kudo.remove( {}, callback );
	},
	like: function( callback ) {
		Like.remove( {}, callback );
	},
	comment: function( callback ) {
		Comment.remove( {}, callback );
	}
}, function ( err, result ) {
	mongoose.connections[ 0 ].close();
	if (err) {
		console.log( 'something went wrong' );
		console.log( err );
	} else {
		console.log( 'documents removed ');
		console.log( result );
		console.log( 'done' );
	}
});

