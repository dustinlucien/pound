/**
 * Dependencies
 */
var natural = require('natural'),
	nounInflector = new natural.NounInflector;

/**
 * Class def
 */
function GenericController () {
	//This didn't work.  how to call super class constructor in JavaScript?
	//this.nounInflector = new natural.NounInflector;
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

<<<<<<< HEAD:restful-backend/app/controllers/generic.js
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
			output.response[ nounInflector.singularize(this.label) ]  = docs;
		}
		output.meta = { code : 200 };
		statusCode = 200;
	} else {
		output.error = { type : 'server', description : err };
		output.meta = { code : 500 };
		statusCode = 500;
=======
GenericController.prototype._respond = function ( res, docs, code, err ) {
	var output = {};

	code = code || 200;
	docs = docs || [];

	if ( ! ( docs instanceof Array ) ) {
		docs = [ docs ];
>>>>>>> ui-first-steps:app/controllers/generic.js
	}

	if ( code !== 200 && ! err ) {
		err = error_message[ code ] || 'Unknown error';
	}

	if ( err ) {
		output.error = {
			type: error_type[ code ] || 'unknown',
			description: err
		};
	}

	output.meta = { code: code };

	output.response = {};
	output.response[ this.label ] = { count: docs.length, items: docs };

	res.send( JSON.stringify( output ), code );
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

