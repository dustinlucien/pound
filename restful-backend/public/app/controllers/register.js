Ext.regController( 'Register', {

	cancel: function () {
		// slide on over to the login panel
		kudos.views.viewport.setActiveItem( 0, {
			type: 'slide',
			direction: 'left'
		});

		var register_panel = kudos.views.register_panel,
			register_form = register_panel.register_form,
			items = register_form.items;

		// reset each form item
		items.each( function ( item ) {
			item.reset();
		});
	},

	hide_password: function ( interaction ) {
		var register_panel = kudos.views.register_panel,
			register_form = register_panel.register_form,
			password_cmp = register_form.getComponent( 2 ),
			password_el = password_cmp.getEl().down( 'input[name="password"]' ),
			hide = interaction.args[ 0 ];

		password_el.dom.type = ( hide ? 'password' : 'text' );
	},

	register: function () {
		// TODO implement
		Ext.Msg.alert( 'Error', 'Action not available yet' );
	}

});
