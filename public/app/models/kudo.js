kudos.models.Kudo = Ext.regModel( 'Kudo', {

	idProperty: '_id',

	fields: [
		{ name: '_id', type: 'string' },
		{ name: 'message', type: 'string' },
		{ name: 'recipient_email', type: 'string' },
		{ name: 'category', type: 'string' }
	],

	validations: [
		{ type: 'presence', field: 'message' },
		{ type: 'presence', field: 'category' },
		{ type: 'presence', field: 'recipient_email' }
	],

	proxy: {
		type: 'rest',
		url: '/kudos',
		reader: {
			type: 'json',
			root: 'response.kudos.items'
		}
	}

});
