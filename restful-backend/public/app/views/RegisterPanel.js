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
				kudos.views.viewport.setActiveItem( 0 );
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
						// TODO refactor these out to a controller
						check: function () {
							register_form.getComponent( 2 ).getEl().down( 'input[name="password"]' ).dom.type = 'password';
						},
						uncheck: function () {
							register_form.getComponent( 2 ).getEl().down( 'input[name="password"]' ).dom.type = 'text';
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
			handler: function () { alert( 'Not yet available' ); }
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
			]
		});

		// always call the super method...
		kudos.views.RegisterPanel.superclass.initComponent.apply( this, arguments );
	}
});

