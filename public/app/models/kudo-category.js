kudos.models.KudoCategory = Ext.regModel( 'KudoCategory', {

	idProperty: '_id',

	fields: [
		{ name: '_id', type: 'string' },
		{ name: 'name', type: 'string' },
		{ name: 'shoutout', type: 'string' },
		{ name: 'description', type: 'string' }
	]

});

kudos.stores.KudoCategory = new Ext.data.Store({
	model: 'KudoCategory',
	autoLoad: false,

	proxy: {
		type: 'rest',
		url: '/kudo_categories',
		reader: {
			type: 'json',
			root: 'response.categories.items'
		}
	}
});
