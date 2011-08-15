
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

GenericController.prototype._403 = function ( req, res ) {
	res.send( 'Action not available', 403 );
};

GenericController.prototype._404 = function ( req, res ) {
	res.send( 'Resource not available', 404 );
};

GenericController.prototype._formatApiResponse = function (res, err, docs) {
	var output = {};  
	var statusCode;
  
	if (!err) {
		output.response = {};
		if (docs == null) {
			statusCode = 200;
		} else if (docs instanceof Array) {
			output.response[ this.label ] = { count : docs.length, items : docs };
		} else {
			output.response[ this.label.substring( 0, this.label.length - 1 ) ]  = docs;
		}
		output.meta = { code : 200 };
		statusCode = 200;
	} else {
		output.error = { type : 'server', description : err };
		output.meta = { code : 500 };
		statusCode = 500;
	}
	res.send(JSON.stringify(output), statusCode);
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

