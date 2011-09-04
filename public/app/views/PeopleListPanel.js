kudos.views.PeopleListPanel = Ext.extend( Ext.List, {
	// let items take up all available with and their required height
	layout: 'fit',
	
	//Get the data from the User object
	store: 'User',
	cls: 'user-profile',
	
	initComponent: function() {
		var tpl = new Ext.XTemplate(
				'<tpl for=".">',       // process the data.kids node
				  '<p>User {#}. {name}</p>',  // use current array index to autonumber
				'</tpl></p>',
			'</div>'
			);

			Ext.apply(this, {itemTpl: tpl});
			
			kudos.views.PeopleListPanel.superclass.initComponent.apply( this, arguments );
	}
});

Ext.reg('kudosPeopleList', kudos.views.PeopleListPanel);