kudos.views.PeopleListPanel = Ext.extend( Ext.Panel, {
	// let items take up all available with and their required height
	layout: 'card',

	initComponent: function() {

		this.list = new Ext.List({
			//Get the data from the User object
			store: 'usersStore',
			cls: 'user-profile',
			singleSelect: true,
			itemTpl: new Ext.XTemplate(
				'<tpl for=".">',       // process the data.kids node
				'<p>User {#}. {name}</p>',  // use current array index to autonumber
				'</tpl>',
				'</div>'
			)
		});
		
		this.list.on('render', function() {
			this.list.store.load();
		}, this);

		this.list.on('selectionchange', this.onSelect, this);
		
		this.listpanel = new Ext.Panel({
        items: this.list,
        layout: 'fit',
        listeners: {
            activate: { fn: function(){
                this.list.getSelectionModel().deselectAll();
                Ext.repaint();
            }, scope: this }
        }
    });

		Ext.apply(this, {items: [this.listpanel]})
		
		kudos.views.PeopleListPanel.superclass.initComponent.apply( this, arguments );
	},
	
	onSelect: function(selectionmodel, records) {
		if (records[0] != undefined) {
			var userProfileCard = new kudos.views.UserProfilePanel({
				prevCard: this.listpanel,
				user: records[0],
				card: true
			});
			
			this.setActiveItem(userProfileCard, 'slide');
		}
	}
});

Ext.reg('kudosPeopleList', kudos.views.PeopleListPanel);