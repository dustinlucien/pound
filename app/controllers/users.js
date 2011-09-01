/**
 * Dependencies
 */

var User = require( '../models/user' );

/**
 * Class def
 */
function UserController () {
	this.label = 'users';
}

// extend the GenericController class
var GenericController = require( './generic.js' );
UserController.prototype.__proto__ = GenericController.prototype;

// export the UserController class
module.exports = UserController;

/**
 * Class methods
 */

//GET /users  ->  index
UserController.prototype.index = function( req, res ) {
	var self = this;

	// TODO filter users
	User.find({}, function( err, docs ) {
		if ( err ) {
			// TODO log
			self._respond( res, {}, 500 );
		} else {
			// TODO only show certain fields
			self._respond( res, docs );
		}
	});
};

//POST /users -> create
UserController.prototype.create = function( req, res ) {
	var self = this;

	// if the records param was not given, return an error
	if ( ! req.body.records ) {
		self._respond( res, {}, 400, 'No records to create' );
	// if more than one record was given, return an error
	} else if ( req.body.records.length !== 1 ) {
		self._respond( res, {}, 400, 'Only one record may be created at a time' );
	// otherwise, create the user
	} else {
		var user = new User({
			email: req.body.records[ 0 ].email,
			password: req.body.records[ 0 ].password,
			name: req.body.records[ 0 ].name
		});

		user.save( function ( err, doc ) {
			if ( err ) {
				var msg = 'Unknown error';
				if ( err.message && err.message.indexOf( 'duplicate' ) > 0 ) {
					msg = 'There is already a user with that email address';
				}
				self._respond( res, {}, 500, msg );
			} else {
				self._respond( res, doc );
			}
		});
	}
};

//GET /users/:user -> show
UserController.prototype.show = function( req, res ) {
	var self = this;

	if ( ! req.params.user ) {
		self._respond( res, {}, 400 );
	} else {
		// TODO only show certain fields
		User.findById( req.params.user, function ( err, doc ) {
			if ( err ) {
				self._respond( res, {}, 500, err );
			} else if ( ! doc ) {
				self._respond( res, {}, 404 );
			} else {
				self._respond( res, doc );
			}
		});
	}
};

//PUT /users/:user -> update
UserController.prototype.update = function ( req, res ) {
	var self = this;

	if ( ! req.params.user || ! req.body ) {
		self._respond( res, null, 400 );
	} else if ( req.params.user !== req.session.uid ) {
		self._respond( res, null, 403, 'Forbidden to update this user' );
	} else {
		var self = this;
		User.findById( req.params.user, function ( err, doc ) {
			if ( err ) {
				self._respond( res, null, 500, err );
			} else if ( ! doc ) {
				self._respond( res, null, 404 );
			} else {
				// TODO validation
				for ( var field in req.body ) {
					doc.set( field, req.body[ field ] );
				}
				doc.save( function ( err, doc ) {
					if ( err ) {
						self._respond( res, null, 500, err );
					} else {
						// TODO only show certain fields
						self._respond( res, doc );
					}
				});
			}
		});
	}
};

//DELETE /users/:user -> delete
UserController.prototype.destroy = function(req, res) {
	// TODO also delete related stuff? maybe mark as inactive, instead...
	var self = this;

	if ( ! req.params.user ) {
		self._respond( res, null, 400 );
	} else if ( req.params.user !== req.session.uid ) {
		self._respond( res, null, 403, 'Forbidden to delete this user' );
	} else {
		User.findById( req.params.user, function ( err, doc ) {
			if ( err ) {
				self._respond( res, null, 500, err );
			} else if ( ! doc ) {
				self._respond( res, null, 404 );
			} else {
				doc.remove( function ( err, doc ) {
					if ( err ) {
						self._respond( res, null, 500, err );
					} else {
						// TODO only show certain fields
						self._respond( res, doc );
					}
				});
			}
		});
	}
};

