kudos.views.RegisterPanel = Ext.extend( Ext.Panel, {
	// panel config
	layout: 'fit',

	// we'll dock a toolbar that displays a title
	dockedItems: [{
		xtype: 'toolbar',
		title: 'Register',
		// the toolbar has a cancel button
		items: [{
			text: 'Cancel',
			ui: 'back',
			handler: function () {
				// dispatch to the Register controller
				Ext.dispatch({
					controller: 'Register',
					action: 'cancel'
				});
			}
		}]
	}],

	initComponent: function () {
		// the registration form, contained in a fieldset
		var register_form = new Ext.form.FieldSet({
			items: [
				{
					xtype: 'textfield',
					name: 'name',
					placeHolder: 'your name'
				},
				{
					xtype: 'emailfield',
					name: 'email',
					placeHolder: 'email'
				},
				{
					xtype: 'textfield',
					name: 'password',
					placeHolder: 'password'
				}
			]
		});

		// the "hide password" option
		// TODO style to spec
		var hide_pw_box = new Ext.form.FieldSet({
			items: [
				{
					xtype: 'checkboxfield',
					name: 'hidepassword',
					label: 'hide password',
					labelWidth: '50%',
					listeners: {
						check: function () {
							Ext.dispatch({
								controller: 'Register',
								action: 'hide_password',
								args: [ true ]
							});
						},
						uncheck: function () {
							Ext.dispatch({
								controller: 'Register',
								action: 'hide_password',
								args: [ false ]
							});
						}
					}
				}
			]
		});

		// the "create account" button
		var submit_button = new Ext.Button({
			text: 'Create Account',
			ui: 'decline',
			padding: '10 0',
			handler: function () {
				Ext.dispatch({
					controller: 'Register',
					action: 'register'
				});
			}
		});

		// add the three items to the panel, wrapped inside a KudosFormPanel
		Ext.apply( this, {
			items: [
				new kudos.views.KudosFormPanel({
					items: [
						register_form,
						hide_pw_box,
						submit_button
					]
				})
			],

			// store the register form on the object so that a controller
			// can more easily access it
			register_form: register_form
		});

		// always call the super method...
		kudos.views.RegisterPanel.superclass.initComponent.apply( this, arguments );
	}
});

