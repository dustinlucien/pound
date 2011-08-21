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
		var register_panel = kudos.views.register_panel,
			name_field = register_panel.down( 'field[name="name"]' ),
			name = name_field.getValue(),
			email_field = register_panel.down( 'field[name="email"]' ),
			email = email_field.getValue(),
			password_field = register_panel.down( 'field[name="password"]' ),
			password = password_field.getValue();

		var new_user = new kudos.models.User({
			name: name,
			email: email,
			password: password
		});

		if ( !new_user.validate().isValid() ) {
			Ext.Msg.alert( 'Error', 'Please include a name, valid email, and password' );
		} else {
			new_user.save({
				success: function () {
					kudos.views.viewport.setActiveItem( 2 );
				},
				failure: function () {
					// TODO detect different errors
					Ext.Msg.alert( 'Error', 'Could not contact server. Please try again' );
				}
			});
		}
	}

});
