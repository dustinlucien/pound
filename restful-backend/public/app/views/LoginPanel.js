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
			ui: 'back',
			// TODO refactor out to a controller
			//handler: function () { this.fireEvent( 'register' ); }
			handler: function () {
				kudos.views.viewport.setActiveItem( 1 );
			}
		}, {
			xtype: 'spacer'
		}, {
			text: 'Sign In',
			ui: 'decline',
			// TODO refactor out to a controller
			//handler: function () { this.fireEvent( 'signin' ); }
			handler: function () {
				alert( 'Not yet available' );
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
	],

	initComponent: function () {
		this.addEvents( [ 'signin', 'register' ] );
		this.enableBubble( [ 'signin', 'register' ] );
		kudos.views.LoginPanel.superclass.initComponent.apply( this, arguments );
	}
	
});

