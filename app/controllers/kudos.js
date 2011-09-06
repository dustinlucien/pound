/**
 * Dependencies
 */

var async = require('async')
	, Kudo = require( '../models/kudo' )
	, User = require( '../models/user' )
	, KudoCategory = require( '../models/kudo-category');

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

function collectUserData(doc, cb) {
	async.parallel({
		sender: function(callback) {
			User.findById( doc.sender, function(err, user) {
				callback(err, user);
			});
		},

		recipient: function(callback) {
			User.findById( doc.recipient, function(err, user) {
				callback(err, user);
			});
		},
		
		category: function(callback) {
			KudoCategory.findById( doc.category, function(err, category) {
				callback(err, category);
			});
		}
	}, function(err, results) {
		if (err) {
			cb(err, null);
		} else {
			doc.sender = trimUserObject(results.sender.toObject());
			doc.recipient = trimUserObject(results.recipient.toObject());
			doc.category = trimCategoryObject(results.category.toObject());
			
			cb(null, doc);	
		}
	});
}

function trimUserObject(user) {
	delete user.likes;
	delete user.comments;
	user.kudos.sent = user.kudos.sent.length;
	user.kudos.received = user.kudos.received.length;
	
	return user;
}

function trimCategoryObject(category) {
	return category;
}

/*
 * encapsulate the super class _respond method, and wrap some other goodness around it
 */
KudoController.prototype.respond = function ( res, docs, code, err ) {
	var self = this;
	
	if (err || (docs == null)) {
		self._respond(res, null, code, err);
	} else {
		if ( ! ( docs instanceof Array ) ) {
			docs = [ docs ];
		}
		
		var i
			, total = 0;
			
		for (i = 0; i < docs.length; i++) {
			(function(i) {
				collectUserData(docs[i].toObject(), function(err, doc) {
					if (err) {
						self._respond(res, null, 500, err);
					} else {
						docs[i] = doc;
						total++;
						if (total == docs.length) {
							self._respond(res, docs, 200);
						}
					}
				});
			})(i);
		}
	}
}

//GET /kudos  ->  index
KudoController.prototype.index = function( req, res ) {
	var self = this;

	// TODO filter kudos
	Kudo.find({}, function( err, docs ) {
		if ( err ) {
			self.respond( res, null, 500, err );
		} else {
			self.respond(res, docs, 200);
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
				self.respond( res, {}, 404, 'No user by that email address' );
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
		self.respond( res, {}, 400, 'No records to create' );
	// if more than one record was given, return an error
	} else if ( req.body.records.length !== 1 ) {
		self.respond( res, {}, 400, 'Only one record may be created at a time' );
	// otherwise, create the kudo
	} else {
		self._build_kudo( req, res, req.body.records[ 0 ], function ( err, kudo ) {
			if ( String( kudo.sender ) !== String( req.session.uid ) ) {
				self.respond( res, {}, 403, 'Cannot send Kudo as another user' );
			} else if ( String( kudo.sender ) === String( kudo.recipient ) ) {
				self.respond( res, {}, 403, 'Cannot send Kudo to yourself' );
			} else {
				kudo.save( function ( err, doc ) {
					// TODO better error response
					if ( err ) {
						self.respond( res, {}, 500, 'Unknown error' );
					} else {
						self.respond( res, doc );
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
		self.respond( res, null, 400 );
	} else {
		Kudo.findById( req.params.kudo, function ( err, doc ) {
			if ( err ) {
				self.respond( res, null, 500, err );
			} else if ( ! doc ) {
				self.respond( res, null, 404 );
			} else {
				self.respond( res, doc );
			}
		});
	}
};

//PUT /kudos/:kudo -> update
KudoController.prototype.update = function ( req, res ) {
	this.respond( res, null, 403 );
};

//DELETE /kudos/:kudo -> delete
KudoController.prototype.destroy = function(req, res) {
	this.respond( res, null, 403 );
};

