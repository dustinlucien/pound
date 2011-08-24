Ext.regController( 'Kudo', {

	reset_categories: function () {
		var cat_buttons = kudos.views.send_kudo_panel._cat_buttons;
		Ext.each( cat_buttons, function ( button ) {
			button.removeCls( 'bright-green' );
			button.addCls( 'bright-blue' );
		});
	},

	select_category: function ( interaction ) {
		var cat_button = interaction.args[ 0 ],
			cat_buttons = kudos.views.send_kudo_panel._cat_buttons;

		Ext.each( cat_buttons, function ( button ) {
			button.removeCls( 'bright-green' );
			button.addCls( 'bright-blue' );
		});

		cat_button.addCls( 'bright-green' );
		cat_button.removeCls( 'bright-blue' );
	},

	send: function () {
		var self = this,
			panel = kudos.views.send_kudo_panel._body_panel,
			email_field = panel.down( 'field[name="recipient_email"]' ),
			email = email_field.getValue(),
			message_field = panel.down( 'field[name="message"]' ),
			message = message_field.getValue(),
			category;

		// TODO make less hacky...
		Ext.each( kudos.views.send_kudo_panel._cat_buttons, function ( button ) {
			if ( button.getEl().hasCls( 'bright-green' ) ) {
				category = button._cat_id;
			}
		});

		var new_kudo = new kudos.models.Kudo({
			recipient_email: email,
			message: message,
			category: category
		});

		// TODO better errors
		if ( ! new_kudo.validate().isValid() ) {
			Ext.Msg.alert( 'Error', 'Please include an email, a message, and select a reason' );
		} else {
			email_field.disable();
			message_field.disable();

			new_kudo.save({
				success: function () {
					email_field.reset();
					email_field.enable();
					message_field.reset();
					message_field.enable();

					self.reset_categories();

					Ext.Msg.alert( 'Awesome!', 'Kudo sent' );
				},
				failure: function ( record, operation ) {
					email_field.enable();
					message_field.enable();

					Ext.Msg.alert( 'Error', 'Unable to send Kudo' );
				}
			});
		}
	}

});
