Ext.regController( 'Login', {

	register: function () {
		// slide on over to the register panel
		kudos.views.viewport.setActiveItem( 1, {
			type: 'slide',
			direction: 'left'
		});
	},

	login: function ( interaction ) {
		// nab the login values
		var login_panel = kudos.views.login_panel,
			email_field = login_panel.down( 'field[name="email"]' )
			email = email_field.getValue(),
			password_field = login_panel.down( 'field[name="password"]' )
			password = password_field.getValue();

		if ( interaction.args && interaction.args.length > 0 ) {
			email = interaction.args[ 0 ];
			password = interaction.args[ 1 ] || password;
		}

		// disable fields
		email_field.disable();
		password_field.disable();

		// make a request to the login endpoint
		Ext.Ajax.request({
			url: '/auth/login',
			method: 'POST',
			jsonData: {
				email: email,
				password: password
			},
			success: function ( response, opts ) {
				var obj = Ext.decode( response.responseText );

				if ( obj.meta.code === 404 ) {
					Ext.Msg.alert( 'Uh oh!', 'Email or password invalid' );
				} else if ( obj.meta.code !== 200 ) {
					Ext.Msg.alert( 'Whoops!', 'Unknown error. Please try again' );
				} else {

					// store this user's id
					kudos.data.uid = obj.uid;

					// slide on over to the app panel
					kudos.views.viewport.setActiveItem( 2, {
						type: 'slide',
						direction: 'right',
						reveal: true
					});

					// reset and enable the fields
					email_field.reset();
					password_field.reset();
				}

				email_field.enable();
				password_field.enable();
			},
			failure: function ( response, opts ) {
				email_field.enable();
				password_field.enable();
				Ext.Msg.alert( 'Error', 'Could not contact server. Please try again' );
			}
		});
	},

	test_session: function () {
		// make a request to the session endpiont
		Ext.Ajax.request({
			url: '/auth/session',
			success: function ( response, opts ) {
				// by default, the activeItem in the viewport will be
				// the login screen
				var obj = Ext.decode( response.responseText ),
					activeItem = 0;

				// if the user is logged in, make the activeItem the
				// app panel itself
				if ( obj.session && obj.session.uid ) {
					activeItem = 2;
					kudos.data.uid = obj.session.uid;
				}

				// instantiate the viewport with the appropriate activeItem
				kudos.views.viewport = new kudos.views.ViewPort({
					activeItem: activeItem
				});
			},
			failure: function ( response, opts ) {
				// TODO we may want a different action here
				kudos.views.viewport = new kudos.views.ViewPort();
			}
		});
	}

});
