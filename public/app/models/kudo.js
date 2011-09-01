kudos.models.Kudo = Ext.regModel( 'Kudo', {

	idProperty: '_id',

	fields: [
		{ name: '_id', type: 'string' },
		{ name: 'message', type: 'string' },
		{ name: 'category', type: 'string' },
		{ name: 'sender', type: 'string' },
		{ name: 'sender_name', type: 'string' },
		{ name: 'recipient', type: 'string' },
		{ name: 'recipient_name', type: 'string' },
		{ name: 'recipient_email', type: 'string' }
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

kudos.stores.Kudo = new Ext.data.Store({
	storeId: 'Kudo',
	model: 'Kudo',
	autoLoad: false,

	proxy: {
		type: 'rest',
		url: '/kudos',
		reader: {
			type: 'json',
			root: 'response.kudos.items'
		}
	},

	data: [
		{
			message: 'Blah blah',
			category: '4e54dd8955b2fa9f05000001',
			sender: '4e5f86e697883b4e05000007',
			sender_name: 'Andrew Peace',
			recipient: '',
			recipient_name: 'Blah Dude'
		}, {
			message: 'Blah blah',
			category: '4e54dd8955b2fa9f05000001',
			recipient: '4e5f86e697883b4e05000007',
			recipient_name: 'Andrew Peace',
			sender: '',
			sender_name: 'Blah Dude'
		}, {
			message: 'Blah blah',
			category: '4e54dd8955b2fa9f05000001',
			recipient: '',
			recipient_name: 'Ron Paul',
			sender: '',
			sender_name: 'Blah Dude'
		}
	]
});
