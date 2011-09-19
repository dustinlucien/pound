/**
 * Dependencies
 */

var KudoCategory = require( '../models/kudo-category' );

/**
 * Class def
 */
function KudoCategoryController () {
	this.label = 'categories';
	this.overrideModelName = true;
}

// extend the GenericController class
var GenericController = require( './generic.js' );
KudoCategoryController.prototype.__proto__ = GenericController.prototype;

// export the KudoCategoryController class
module.exports = KudoCategoryController;

/**
 * Class methods
 */

//GET /kudo_categories  ->  index
KudoCategoryController.prototype.index = function( req, res ) {
	var self = this;

	KudoCategory.find({}, function( err, docs ) {
		if ( err ) {
			self._respond( res, null, 500, err );
		} else {
			self._respond( res, docs );
		}
	});
};

//POST /kudo_categories -> create
KudoCategoryController.prototype.create = function( req, res ) {
	this._respond( res, null, 403 );
};

//GET /kudo_categories/:kudo_categorie -> show
KudoCategoryController.prototype.show = function( req, res ) {
	var self = this;

	if ( ! req.params.kudo_categorie ) {
		self._respond( res, null, 400 );
	} else {
		KudoCategory.findById( req.params.kudo_categorie, function ( err, doc ) {
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

//PUT /kudo_categories/:kudo_categorie -> update
KudoCategoryController.prototype.update = function ( req, res ) {
	this._respond( res, null, 403 );
};

//DELETE /kudo_categories/:kudo_categorie -> delete
KudoCategoryController.prototype.destroy = function(req, res) {
	this._respond( res, null, 403 );
};
