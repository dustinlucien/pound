kudos.views.LoginPanel = Ext.extend( Ext.Panel, {
	// panel config
	layout: 'fit',

	// we'll dock a toolbar that displays a title
	dockedItems: [{
		xtype: 'toolbar',
		title: 'Kudos',
		// two buttons occupy the toolbar, separated by a spacer
		items: [{
			text: 'Register',
			ui: 'back'
		}, {
			xtype: 'spacer'
		}, {
			text: 'Sign In',
			ui: 'decline'
		}]
	}],

	items: [
		// the body panel
		new Ext.Panel({
			// padding of 5px on all sides
			bodyPadding: 5,
			items: [
				// the text above the login form
				{
					html: 'Hi there, ready to sign in?',
					// adjust padding
					padding: '10 0 0 5'
				},
				// a login form contained in a fieldset
				{
					xtype: 'fieldset',
					items: [
						{
							xtype: 'emailfield',
							name: 'email',
							placeHolder: 'email'
						},
						{
							xtype: 'passwordfield',
							name: 'password',
							placeHolder: 'password'
						}
					]
				}
			]
		})
	]
	
});
