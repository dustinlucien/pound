var URL = require( 'url' ),
	mongoose = require( 'mongoose' ),
	User = require('../models/user');

// allow a request if a valid session is present or if a certain
// path is being accessed (such as a new account registration)
function access_allowed ( req, res, url, is_session ) {
	// TODO clean up handling of allowed paths
	return ( is_session ) ||
		   ( url.pathname === '/kudo_categories' || url.pathname === '/kudo_categories/' ) ||
		   ( ( url.pathname === '/users' || url.pathname === '/users/' ) &&
			 req.method === 'POST' );
}

function login ( req, res ) {
	var filter = {
		email: req.body.email,
		password: User.encrypt_pass( req.body.password )
	};

	// find users with the given email/password combination
	User.find( filter, function ( err, docs ) {
		// if we found the user, set the id on the session
		// and respond with a success code
		if ( docs.length === 1 ) {
			req.session.uid = docs[ 0 ]._id;
			res.send( JSON.stringify( { meta: { code: 200 }, uid: docs[ 0 ]._id } ) );
		// otherwise, respond with a 'not found' code
		} else {
			res.send( JSON.stringify( { meta: { code: 404 } } ) );
		}
	});
}

function logout ( req, res ) {
	req.session.destroy( function () {
		res.send( JSON.stringify( { meta: { code: 200 } } ) );
	});
}

function forbid ( req, res ) {
	res.send({
		meta: {
			code: 401
		},
		error: {
			type: 'client',
			description: 'Authorization required'
		}
	}, 401 );
}

module.exports = function ( req, res, next ) {
	var url = URL.parse( req.url ),
		is_session = ( req.session && req.session.uid );

	// always return the session object at /auth/session
	if ( url.pathname === '/auth/session' ) {
		var session = null;
		if ( is_session ) {
			session = { uid: req.session.uid };
		}
		res.send( { meta: { code: 200 }, session: session } );
		return;

	// always process login requests
	} else if ( url.pathname === '/auth/login' ) {
		login( req, res );

	// always process logout requests
	} else if ( url.pathname === '/auth/logout' ) {
		logout( req, res );

	// allow all users to access certain paths, regardless
	// of session status
	} else if ( access_allowed( req, res, url, is_session ) ) {
		next();
		return;

	// all other requests get 403'd
	} else {
		forbid( req, res );
	}
};
