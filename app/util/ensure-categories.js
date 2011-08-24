var KudoCategory = require( '../models/kudo-category' ),

	fs = require( 'fs' ),
	cat_data = fs.readFileSync( __dirname + '/data/categories.json', 'utf8' ),
	cats = JSON.parse( cat_data );

module.exports = function ( log, cb ) {

KudoCategory.find( {}, function ( err, docs ) {
	if ( docs && docs.length > 0 ) {
		if ( log ) { console.log( 'Categories already imported' ); }
		cb();
	} else {
		if ( log ) { console.log( 'Importing categories...' ); }

		var saved = 0;

		for ( var i = 0, l = cats.length; i < l; i++ ) {
			new KudoCategory( cats[ i ] ).save( function ( err, doc ) {
				if ( err ) {
					if ( log ) { console.log( 'ERROR importing categories', err ); }
					process.exit();
				} else {
					saved++;
					if ( saved === l ) {
						if ( log ) { console.log( 'Successfully imported categories' ); }
						cb();
					}
				}
			});
		}
	}
});

};
