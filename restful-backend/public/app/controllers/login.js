Ext.regController( 'Login', {

	register: function () {
		// slide on over to the register panel
		kudos.views.viewport.setActiveItem( 1, {
			type: 'slide',
			direction: 'left'
		});
	},

	login: function () {
		// TODO implement
		Ext.Msg.alert( 'Error', 'Action not available yet' );
	}

});
