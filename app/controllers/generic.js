var plural = require('../util/pluralize');
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
	var output = {}
		, success = true;

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
	output.success = success;
	output.meta = { code: code };

	//try to take the label from the type of the model, not the controller
	var label;
	if ( this.overrideModelName || ( docs.length === 0 ) ) {
		label = this.label;
	} else {
		label = plural.pluralize( docs[0].constructor.modelName.toLowerCase() );	
	}

	output.response = {};

	if ( err ) {
		output.error = {
			type: error_type[ code ] || 'unknown',
			description: err
		};

		output.response[ label ] = { count: 0, items: [{}] };

		res.send( JSON.stringify( output ) );
	} else {

		var populated = []
			, total = 0
			, i;

		var self = this;

		if ( docs.length === 0 ) {
			output.response[ label ] = { count: 0, items: [] };
			res.send( JSON.stringify( output ) );
		} else {
			for ( i = 0; i < docs.length; i++ ) {
				(function ( i ) {
					docs[i].populateResponse(function( err, out ) {
						if ( err ) {
							self._respond( res, null, 500, err );
						} else {
							populated.push( out );
							total++;
							if ( total === docs.length ) {
								output.response[ label ] = { count: populated.length, items: populated };
								res.send( JSON.stringify( output ) );
							}
						}
					});
				})( i );
			}
		}
	}
};

GenericController.prototype._paginate = function( req, query ) {
	query = query || {};
	
	var sort = 'created'
		, order = 'descending'
		, start = 0
		, limit = 50;
		
	if ( 'sort' in req.query ) {
		if ( 'order' in req.query ) {
			if ( req.query.order.toLowerCase() === 'asc') {
				order = 'ascending';
			}
		}
	}
	
	if ( 'start' in req.query ) {
		start = parseInt( req.query.start );
	}
	
	if ( 'limit' in req.query ) {
		limit = parseInt( req.query.limit );
	}
	
	query = query.sort( sort, order ).skip( start ).limit( limit );
	
	return query;
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

