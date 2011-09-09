var assert = require( 'assert' ),
	request = require( 'request' ),
	mongoose = require( 'mongoose' );

var api_uri = exports.api_uri = 'http://localhost:' + ( process.env[ 'PORT' ] || 3000 ) + '/',
	//mongo_uri = exports.mongo_uri = 'mongo://127.0.0.1:27017/test';
	mongo_uri = exports.mongo_uri = 'mongodb://testing_user:kud05@dbh30.mongolab.com:27307/development';

var merge = exports.merge = function ( header1, header2 ) {
	var header3 = {};
	for ( key in header1 ) {
		header3[ key ] = header1[ key ];
	}
	for ( key in header2 ) {
		header3[ key ] = header2[ key ];
	}
	return header3;
}

function checkResponse ( err, res, body, callback ) {
	//assert.isNull( err );
	assert.isNotNull( res );
	callback( err, res, body );
}

var api = exports.api = {
	get: function ( path, headers, callback ) {
		assert.isNotNull( path );
		assert.isNotNull( callback );

		request.get({ uri: api_uri + path, headers: headers }, function ( err, res, body ) {
			checkResponse( err, res, body, callback );
		});
	},

	post: function ( path, payload, headers, callback ) {
		assert.isNotNull( path );
		assert.isNotNull( payload );
		assert.isNotNull( callback );

		request.post({ uri: api_uri + path, body: payload, headers: headers }, function ( err, res, body ) {
			checkResponse( err, res, body, callback );
		});
	},

	put: function ( path, payload, headers, callback ) {
		assert.isNotNull( path );
		assert.isNotNull( payload );
		assert.isNotNull( callback );

		request({ method: 'PUT', uri: api_uri + path, body: payload, headers: headers }, function ( err, res, body ) {
			checkResponse( err, res, body, callback );
		});
	},

	del: function ( path, headers, callback ) {
		assert.isNotNull( path );
		assert.isNotNull( callback );
		request({ method: 'DELETE', uri: api_uri + path, headers: headers }, function ( err, res, body ) {
			checkResponse( err, res, body, callback );
		});
	}
};

mongoose.connect( mongo_uri );

var teardown = exports.teardown = function () {
	mongoose.connections[ 0 ].close();
};
