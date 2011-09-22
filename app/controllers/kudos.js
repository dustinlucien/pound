/**
 * Dependencies
 */

var async = require('async'),
		Kudo = require( '../models/kudo' ),
		User = require( '../models/user' ),
		KudoCategory = require( '../models/kudo-category');

/**
 * Class def
 */
function KudoController () {
	this.label = 'kudos';
}

// extend the GenericController class
var GenericController = require( './generic.js' );
KudoController.prototype.__proto__ = GenericController.prototype;

// export the KudoController class
module.exports = KudoController;

//GET /kudos  ->  index
KudoController.prototype.index = function( req, res ) {
	var self = this;

	// TODO filter kudos
	self._paginate( req, Kudo.find( {} ) )
		.execFind( function( err, docs ) {
			if ( err ) {
				self._respond( res, null, 500, err );
			} else {
				self._respond( res, docs, 200 );
			}
		});
};

KudoController.prototype._build_kudo = function ( req, res, fields, cb ) {
	var self = this;
	fields._id = null;

	if ( ! fields.sender ) {
		fields.sender = req.session.uid;
	}

	if ( fields.parent === '' ) {
		delete fields.parent;
	}

	if ( fields.recipient ) {
		cb( null, new Kudo({
			recipient: fields.recipient,
			sender: fields.sender,
			message: fields.message,
			category: fields.category,
			parent: fields.parent
		}));
	} else if ( fields.recipient_email ) {
		User.find( { email: fields.recipient_email }, function ( err, docs ) {
			if (err) {
				self._respond( res, null, 500, err );
			} else if ( ! docs || docs.length < 1 ) {
				self._respond( res, null, 404, 'No user by that email address' );
			} else {
				cb( null, new Kudo({
					recipient: docs[ 0 ]._id,
					sender: fields.sender,
					message: fields.message,
					category: fields.category,
					parent: fields.parent
				}));
			}
		});
	}
};

//POST /kudos -> create
KudoController.prototype.create = function( req, res ) {
	var self = this;

	// if the records param was not given, return an error
	if ( ! req.body.records ) {
		self._respond( res, null, 400, 'No records to create' );
	// if more than one record was given, return an error
	} else if ( req.body.records.length !== 1 ) {
		self._respond( res, null, 400, 'Only one record may be created at a time' );
	// otherwise, create the kudo
	} else {
		User.findById( req.session.uid, function ( err, user ) {
			if (err) {
				self._respond( res, null, 500, err);
			} else if (user.kudos.have > 0) {
				self._build_kudo( req, res, req.body.records[ 0 ], function ( err, kudo ) {
					if (err) {
						self._respond( res, null, 500, err );
					} else if ( String( kudo.sender ) !== String( req.session.uid ) ) {
						self._respond( res, null, 403, 'Cannot send Kudo as another user' );
					} else if ( String( kudo.sender ) === String( kudo.recipient ) ) {
						self._respond( res, null, 403, 'Cannot send Kudo to yourself' );
					} else {
						kudo.save( function ( err, doc ) {
							if ( err ) {
								var err_message = err.message || 'Unknown error',
									err_code = ( err.message && 403 ) || 500;

								self._respond( res, null, err_code, err_message );
							} else {
								self._respond( res, doc );
							}
						});
					}
				});
			}
		});
	}
};

KudoController.prototype._find_kudo = function ( req, res, cb ) {
	var self = this;

	if ( ! req.params.kudo ) {
		self._respond( res, null, 400 );
	} else {
		Kudo.findById( req.params.kudo, function ( err, doc ) {
			if ( err ) {
				self._respond( res, null, 500, err );
			} else if ( ! doc ) {
				self._respond( res, null, 404 );
			} else {
				cb( doc );
			}
		});
	}
};

//GET /kudos/:kudo -> show
KudoController.prototype.show = function( req, res ) {
	var self = this;
	this._find_kudo( req, res, function ( kudo ) {
		self._respond( res, kudo );
	});
};

KudoController.prototype.gloms = function ( req, res ) {
	var self = this;
	this._find_kudo( req, res, function ( kudo ) {
		kudo.findGloms( {}, function ( err, gloms ) {
			if ( err ) {
				self._respond( res, null, 500 );
			} else {
				self._respond( res, gloms );
			}
		});
	});
};

KudoController.prototype.create_like = function( req, res ) {
	var self = this;
	this._find_kudo( req, res, function( kudo ) {
		var Like = kudo.model('Like');
		var like = new Like();
		like.sender = req.session.uid;
		like.kudo = kudo;
		like.save( function ( err, doc ) {
			if (err) {
				self._respond( res, null, 500);
			} else {
				self._respond( res, doc, 200);
			}
		});
	});
};

KudoController.prototype.likes = function ( req, res ) {
	var self = this;
	this._find_kudo( req, res, function ( kudo ) {
		kudo.findLikes( {}, function ( err, likes ) {
			if ( err ) {
				self._respond( res, null, 500 );
			} else {
				self._respond( res, likes );
			}
		});
	});
};

//PUT /kudos/:kudo -> update
KudoController.prototype.update = function ( req, res ) {
	this._respond( res, null, 403 );
};

//DELETE /kudos/:kudo -> delete
KudoController.prototype.destroy = function(req, res) {
	this._respond( res, null, 403 );
};

