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
		// a login form
		new Ext.form.FormPanel({
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
		})
	]
	
});
