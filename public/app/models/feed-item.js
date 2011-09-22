kudos.models.FeedItem = Ext.regModel( 'FeedItem', {
	idProperty: '_id',

	fields: [
		{ name: '_id', type: 'string' },
		{ name: 'item', type: 'object' },
		{ name: 'type', type: 'string' },
		{ name: 'created', type: 'date' }
	]
});
