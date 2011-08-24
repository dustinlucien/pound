/**
 * Dependencies
 */

var Kudo = require( '../models/kudo' ),
	User = require( '../models/user' );

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

/**
 * Class methods
 */

//GET /kudos  ->  index
KudoController.prototype.index = function( req, res ) {
	var self = this;

	// TODO filter kudos
	Kudo.find({}, function( err, docs ) {
		if ( err ) {
			self._respond( res, null, 500, err );
		} else {
			self._respond( res, docs );
		}
	});
};

KudoController.prototype._build_kudo = function ( req, res, fields, cb ) {
	var self = this;
	fields._id = null;

	if ( ! fields.sender ) {
		fields.sender = req.session.uid;
	}

	if ( fields.recipient ) {
		cb( null, new Kudo({
			recipient: fields.recipient,
			sender: fields.sender,
			message: fields.message,
			category: fields.category
		}));
	} else if ( fields.recipient_email ) {
		User.find( { email: fields.recipient_email }, function ( err, docs ) {
			if ( ! docs || docs.length < 1 ) {
				self._respond( res, fields, 404, 'No user by that email address' );
			} else {
				cb( null, new Kudo({
					recipient: docs[ 0 ]._id,
					sender: fields.sender,
					message: fields.message,
					category: fields.category
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
		self._build_kudo( req, res, req.body.records[ 0 ], function ( err, kudo ) {
			if ( String( kudo.sender ) !== String( req.session.uid ) ) {
				self._respond( res, null, 403, 'Cannot send Kudo as another user' );
			} else if ( String( kudo.sender ) === String( kudo.recipient ) ) {
				self._respond( res, null, 403, 'Cannot send Kudo to yourself' );
			} else {
				kudo.save( function ( err, doc ) {
					// TODO better error response
					if ( err ) {
						self._respond( res, null, 500, err );
					} else {
						self._respond( res, doc );
					}
				});
			}
		});
	}
};

//GET /kudos/:kudo -> show
KudoController.prototype.show = function( req, res ) {
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
				self._respond( res, doc );
			}
		});
	}
};

//PUT /kudos/:kudo -> update
KudoController.prototype.update = function ( req, res ) {
	this._respond( res, null, 403 );
};

//DELETE /kudos/:kudo -> delete
KudoController.prototype.destroy = function(req, res) {
	this._respond( res, null, 403 );
};

