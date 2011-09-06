kudos.stores.Kudo = new Ext.data.Store({
	storeId: 'kudoStore',
	model: 'Kudo',
	pageSize: 25,
	autoLoad: false,
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
	/*
	Moved this effort to the server
	listeners: {
		load: {
			fn : function(store, records) {
				console.log('inside kudosStore load store call');
				var i;
				for (i = 0; i < records.length; i++) {
					var kudo = records[i].data;
					//get the sender and recipient data we'll be interested in
					if (kudo) {
						User = Ext.ModelMgr.getModel('User');
						User.load(kudo.sender, {
							success: function(user) {
								var k = store.findRecord('sender', user.getId());
								k.data.sender = user.data;
							}
						});
					
						User.load(kudo.recipient, {
							success: function(user) {
								var k = store.findRecord('recipient', user.getId());
								k.data.recipient = user.data;
							}
						});
					}
				}
			}
		}
	}
	*/
});