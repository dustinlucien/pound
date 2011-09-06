Ext.regController( 'Kudo', {

	reset_categories: function (options) {
		var cat_buttons = options.cat_buttons;
		Ext.each( cat_buttons, function ( button ) {
			button.removeCls( 'bright-green' );
			button.addCls( 'bright-blue' );
		});
	},

	select_category: function ( options ) {
		var cat_button = options.args[ 0 ],
			cat_buttons = options.cat_buttons;

		Ext.each( cat_buttons, function ( button ) {
			button.removeCls( 'bright-green' );
			button.addCls( 'bright-blue' );
		});

		cat_button.addCls( 'bright-green' );
		cat_button.removeCls( 'bright-blue' );
	},

	send: function (options) {
		var self = this,
			panel = options.body_panel,
			message_field = panel.down( 'field[name="message"]' ),
			message = message_field.getValue(),
			recipient_field = panel.down( 'field[name="recipient"]'),
			recipient = recipient_field.getValue(),
			category;

		// TODO make less hacky...
		Ext.each( options.cat_buttons, function ( button ) {
			if ( button.getEl().hasCls( 'bright-green' ) ) {
				category = button._cat_id;
			}
		});

		var new_kudo = new kudos.models.Kudo({
			sender: kudos.data.uid,
			recipient: recipient,
			message: message,
			category: category
		});

		// TODO better errors
		if ( ! new_kudo.validate().isValid() ) {
			Ext.Msg.alert( 'Whoops!', 'Please include an email, a message, and select a reason' );
		} else {
			message_field.disable();

			new_kudo.save({
				success: function ( record, operation ) {
					var obj = Ext.decode( operation.response.responseText );

					if ( obj.meta.code === 200 ) {
						email_field.reset();
						message_field.reset();

						self.reset_categories(options);

						Ext.Msg.alert( 'Awesome!', 'Kudo sent' );
					} else {
						// TODO on Android 2.1 this alert is impossible to close...
						Ext.Msg.alert( 'Uh oh!', obj.error.description );
					}
					message_field.enable();
				},
				failure: function ( record, operation ) {
					message_field.enable();

					Ext.Msg.alert( 'Whoops!', 'Unable to contact server. Please try again.' );
				}
			});
		}
	}

});
