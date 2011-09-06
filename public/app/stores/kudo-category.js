kudos.stores.KudoCategory = new Ext.data.Store({
	model: 'KudoCategory',
	storeId: 'kudoCategoryStore',
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
