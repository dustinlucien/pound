kudos.models.KudoCategory = Ext.regModel( 'KudoCategory', {

	idProperty: '_id',

	fields: [
		{ name: '_id', type: 'string' },
		{ name: 'name', type: 'string' },
		{ name: 'shoutout', type: 'string' },
		{ name: 'description', type: 'string' }
	]

});
