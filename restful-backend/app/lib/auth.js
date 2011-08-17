var URL = require( 'url' ),
	mongoose = require( 'mongoose' ),
	User = require('../models/user'),
	UserModel = mongoose.model( 'User' );

// allow a request if a valid session is present or if a certain
// path is being accessed (such as a new account registration)
function access_allowed ( req, res, url, is_session ) {
	return ( is_session ) ||
		   ( url.pathname === '/users/create' );
}

function login ( req, res ) {
	var email = req.param( 'email' ),
		clear_pass = req.param( 'password' ),
		pass = UserModel.encrypt_pass( clear_pass );

	// find users with the given email/password combination
	UserModel.find({ email: email, password: pass }, function ( err, docs ) {
		// if we found the user, set the id on the session
		// and respond with a success code
		if ( docs.length === 1 ) {
			req.session.uid = docs[ 0 ]._id;
			res.send( { meta: { code: 200 } } );
		// otherwise, respond with a 'not found' code
		} else {
			res.send( { meta: { code: 404 } } );
		}
	});
}

function logout ( req, res ) {
	req.session.destroy( function () {
		res.send( { meta: { code: 200 } } );
	});
}

function forbid ( req, res ) {
	res.send( 'Authorization required', 403 );
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
