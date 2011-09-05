kudos.stores.Kudo = new Ext.data.Store({
	storeId: 'kudosStore',
	model: 'Kudo',
	autoLoad: true,
	/*
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
	],
	*/
	listeners: {
		load: {
			fn : function(data) {
				console.log('inside kudosStore load store call');
				console.log(data);
			}
		}
	}
});