kudos.models.User = Ext.regModel( 'User', {

	idProperty: '_id',

	fields: [
		{ name: '_id', type: 'string' },
		{ name: 'name', type: 'string' },
		{ name: 'email', type: 'email' },
		{ name: 'password', type: 'string' }
	],

	associations: [
		{ type: 'hasMany', model: 'Kudo', name: 'kudos_sent' },
		{ type: 'hasMany', model: 'Kudo', name: 'kudos_recieved' }
	],

	validations: [
		{ type: 'presence', field: 'name' },
		{ type: 'presence', field: 'email' },
		{ type: 'format', field: 'email', matcher: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i },
		{ type: 'presence', field: 'password' }
	],

	proxy: {
		type: 'rest',
		url: '/users',
		reader: {
			type: 'json',
			root: 'response.users.items'
		}
	}

});

kudos.stores.User = new Ext.data.Store({
	storeId: 'User',
	model: 'User',
	autoLoad: true
});