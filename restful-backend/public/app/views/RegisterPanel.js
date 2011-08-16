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
			ui: 'back'
		}]
	}],

	items: [
		// nothing yet
	]
	
});
