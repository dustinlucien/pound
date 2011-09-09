var vows = require( 'vows' ),
	assert = require( 'assert' ),
	request = require( 'request' ),
	lib = require( '../test-lib' ),
	teardown = lib.teardown,
	api_uri = lib.api_uri;

vows.describe( 'Kudos Resources Tests' ).addBatch({

	'WHEN I request the index page': {
		topic: function () {
			request( api_uri, this.callback );
		},
		'THEN I should get a 200 code': function ( err, res, body ) {
			assert.equal( res.statusCode, 200 );
		},
		'THEN the response should begin with a doctype': function ( err, res, body ) {
			var doctype = body.substring( 0, 9 ).toLowerCase();
			assert.equal( doctype, '<!doctype' );
		}
	},

	'WHEN I request the main app script': {
		topic: function () {
			request( api_uri + 'app/app.js', this.callback );
		},
		'THEN I should get a 200 code': function ( err, res, body ) {
			assert.equal( res.statusCode, 200 );
		},
		'THEN it should be type "application/javascript"': function ( err, res, body ) {
			var content_type = res.headers[ 'content-type' ];
			assert.equal( content_type, 'application/javascript' );
		}
	},

	teardown: teardown

}).export( module );
