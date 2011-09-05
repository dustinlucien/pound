kudos.models.User = Ext.regModel( 'User', {

	idProperty: '_id',

	fields: [
		{ name: '_id', type: 'string' },
		{ name: 'name', type: 'string' },
		{ name: 'email', type: 'email' },
		{ name: 'password', type: 'string' },
		{ name: 'kudos.have', type: 'int' }
	],

	associations: [
		{ type: 'hasMany', model: 'Kudo', name: 'kudos.sent' },
		{ type: 'hasMany', model: 'Kudo', name: 'kudos.received' }
	],

	validations: [
		{ type: 'presence', field: 'name' },
		{ type: 'presence', field: 'email' },
		{ type: 'format', field: 'email', matcher: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i },
		{ type: 'presence', field: 'password' }
	],
	proxy: {
		type: 'rest',
		url: 'users',
		startParam: 'start',
		limitParam: 'limit',
		sortParam: 'sort',
		reader: {
			type: 'json',
			root: 'response.users.items'
		}
	}
});