var URL = require( 'url' );

// allow a request if a valid session is present or if a certain
// path is being accessed (such as a new account registration)
function access_allowed ( req, res, url, is_session ) {
	return ( is_session ) ||
		   ( url.pathname === '/users/create' );
}

function login ( req, res ) {
	res.send( 'No login yet' );
}

function logout ( req, res ) {
	res.send( 'No logout yet' );
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
		res.send( { session: session } );
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
