kudos.models.Kudo = Ext.regModel( 'Kudo', {

	idProperty: '_id',

	fields: [
		{ name: '_id', type: 'string' },
		{ name: 'message', type: 'string' },
		{ name: 'recipient_email', type: 'string' },
		{ name: 'category', type: 'string' }
	],

	associations: [
		{ type: 'belongsTo', model: 'User', name: 'sender' },
		{ type: 'belongsTo', model: 'User', name: 'recipient' }
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
			category: '1234',
			sender: {
				name: 'Bean Head'
			},
			recipient: {
				name: 'Rice Face'
			}
		}, {
			message: 'Hallo',
			category: '1234',
			sender: {
				name: 'Blah Dude'
			},
			recipient: {
				name: 'Neat Guy'
			}
		}
	]
});
