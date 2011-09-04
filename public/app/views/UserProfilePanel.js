kudos.views.UserProfilePanel = Ext.extend( Ext.Panel, {
	// let items take up all available with and their required height
	layout: 'fit',
	
	//Get the data from the User object
	store: 'User',
	cls: 'user-profile',
	
	initComponent: function() {
		var nameTpl = new Ext.XTemplate(
			'<div>',
				'<h2 class="user-name">My userId is {kudos.data.uid}</h2>',
				'<p>The beginning of the User profile page</p>',
			'</div>'
			);

			Ext.apply(this, {items: [nameTpl]});
			
			kudos.views.UserProfilePanel.superclass.initComponent.apply( this, arguments );
	}
});

Ext.reg('kudosUserProfile', kudos.views.UserProfilePanel);