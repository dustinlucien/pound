kudos.views.LoginPanel = Ext.extend( Ext.Panel, {
	// let items take up all available with and their required height
	layout: 'fit',

	// dock a toolbar that displays a title
	dockedItems: [{
		xtype: 'toolbar',
		title: 'Kudos',
		// two buttons occupy the toolbar, separated by a spacer
		items: [{
			text: 'Register',
			ui: 'back',
			handler: function () {
				// dispatch to the Login controller
				Ext.dispatch({
					controller: 'Login',
					action: 'register'
				});
			}
		}, {
			xtype: 'spacer'
		}, {
			text: 'Sign In',
			ui: 'decline',
			handler: function () {
				// dispatch to the Login controller
				Ext.dispatch({
					controller: 'Login',
					action: 'login'
				});
			}
		}]
	}],

	items: [
		// the body panel
		new kudos.views.KudosFormPanel({
			items: [
				// the text above the login form
				{
					html: 'Hi there, ready to sign in?',
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

