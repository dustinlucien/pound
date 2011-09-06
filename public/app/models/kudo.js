kudos.models.Kudo = Ext.regModel( 'Kudo', {

	idProperty: '_id',

	fields: [
		{ name: '_id', type: 'string' },
		{ name: 'message', type: 'string' },
		{ name: 'category', type: 'string' },
		{ name: 'sender', type: 'object'},
		{ name: 'recipient', type: 'object'}
	],
	/*
	associations: [
		{ type: 'belongsTo', model: 'User', name: 'sender'},
		{ type: 'belongsTo', model: 'User', name: 'recipient'}
	],
	*/
	validations: [
		{ type: 'presence', field: 'message' },
		{ type: 'presence', field: 'category' },
		{ type: 'presence', field: 'recipient' }
	],

	proxy: {
		type: 'rest',
		url: 'kudos',
		startParam: 'start',
		limitParam: 'limit',
		sortParam: 'sort',
		reader: {
			type: 'json',
			root: 'response.kudos.items',
			totalProperty: 'response.kudos.count',
			successProperty: 'success'
		}
	}

});