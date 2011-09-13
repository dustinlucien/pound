/**
 * Class def
 */
function GenericController () {
}

// export the GenericController class
module.exports = GenericController;

/**
 * "Private" methods
 */

var error_message = {
	400: 'Bad request',
	401: 'Authorization required',
	403: 'Forbidden',
	404: 'Resource not found',
	500: 'Server error'
};

var error_type = {
	400: 'client',
	401: 'client',
	403: 'client',
	404: 'client',
	500: 'server'
};

GenericController.prototype._respond = function ( res, docs, code, err ) {
	var output = {},
		success = true;

	code = code || 200;
	docs = docs || [];

	if ( ! ( docs instanceof Array ) ) {
		docs = [ docs ];
	}

	if ( code !== 200 ) {
		success = false;
		if ( ! err ) {
			err = error_message[ code ] || 'Unknown error';
		}
	}

	if ( err ) {
		output.error = {
			type: error_type[ code ] || 'unknown',
			description: err
		};
	}

	output.success = success;

	output.meta = { code: code };

	output.response = {};
	output.response[ this.label ] = { count: docs.length, items: docs };

	res.send( JSON.stringify( output ) );
};

GenericController.prototype._paginate = function( req, query, cb ) {
	var sort = 'created'
		, order = -1,
		, start = 0,
		, limit = 25;
		
	if ( 'sort' in req.query ) {
		if ( 'order' in req.query ) {
			if ( req.query.order.toLowerCase() === 'asc') {
				order = 1;
			}
		}
	}
	
	if ( 'start' in req.query ) {
		start = parseInt( req.query.start );
	}
	
	if ( 'limit' in req.query ) {
		limit = parseInt( req.query.limit );
	}
	
	query.sort( sort, order )
			 .skip( start )
			 .limit( limit )
			 .exec(cb);
};
/**
 * "Public" methods
 */

GenericController.prototype.router = function () {
	// create a closure for each method and expose them each as
	// a property on a plain object
	var self = this;
	return {
		index: function () { self.index.apply( self, arguments ); },
		show: function () { self.show.apply( self, arguments ); },
		new: function () { self.new.apply( self, arguments ); },
		create: function () { self.create.apply( self, arguments ); },
		edit: function () { self.edit.apply( self, arguments ); },
		update: function () { self.update.apply( self, arguments ); },
		destroy: function () { self.destroy.apply( self, arguments ); }
	};
};

