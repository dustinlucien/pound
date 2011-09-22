/**
 * Dependencies
 */

var Like = require( '../models/like' );
		
/**
 * Class def
 */
function LikeController () {
	this.label = 'likes';
}

// extend the GenericController class
var GenericController = require( './generic.js' );
LikeController.prototype.__proto__ = GenericController.prototype;

// export the UserController class
module.exports = LikeController;

/**
 * Class methods
 */
LikeController.prototype.load = function( req, id, callback ) {
	// TODO only show certain fields
	Like.findById( id, function ( err, doc ) {
		if ( err ) {
			callback ( err, null );
		} else if ( !doc ) {
			callback( new Error( 'unable to find user' ) , null );
		} else {
			callback( null, doc );
		}
	});
}

//GET /likes  ->  index
LikeController.prototype.index = function( req, res ) {
	var self = this;

	Like.find({}, function( err, docs ) {
		if ( err ) {
			self._respond( res, {}, 500 );
		} else {
			self._respond( res, docs );
		}
	});
};

//POST /likes -> create
LikeController.prototype.create = function( req, res ) {
	this._respond( res, null, 403 );
};

//GET /likes/:like -> show
LikeController.prototype.show = function( req, res ) {
	this._respond( res, req.like, 200 );
};

//PUT /likes/:like -> update
LikeController.prototype.update = function ( req, res ) {
	this._respond( res, null, 403 );
};

//DELETE /likes/:like -> delete
LikeController.prototype.destroy = function( req, res ) {
	this._respond( res, null, 403 );
};
