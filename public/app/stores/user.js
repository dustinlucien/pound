kudos.stores.User = new Ext.data.Store({
	model: 'User',
	storeId: 'usersStore',
	pageSize: 25,
	autoLoad: false
	/*
	listeners: {
		load: {
			fn : function(data) {
				console.log('inside userStore load store call');
				console.log(data);
			}
		}
	}
	*/
});