module.exports = function timestamp ( schema, options ) {

	schema.add({ created: Date });

	schema.add({ updated: Date });

	var parallel = ( options && options.parallel ) || false;

	schema.pre( 'save', parallel, function ( next, done ) {
		var date = Date.now();

		if ( this.isNew ) {
			this.created = date;
		}

		this.updated = date;

		if ( parallel ) {
			done();
		} else {
			next();
		}
	});

	if ( options && options.index ) {
		schema.path( 'updated' ).index( options.index );
		schema.path( 'created' ).index( options.index )
	}
};
