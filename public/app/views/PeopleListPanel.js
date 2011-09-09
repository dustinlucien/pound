kudos.views.PeopleListPanel = Ext.extend( Ext.Panel, {
	// let items take up all available width and their required height
	layout: 'card',

	initComponent: function() {

		// the actual list
		this.list = new Ext.List({
			//Get the data from the User object
			store: 'usersStore',
			cls: 'user-profile',
			singleSelect: true,
			itemTpl: new Ext.XTemplate(
				'<p>User {#}. {name}</p>'  // use current array index to autonumber
			)
		});

		// load the store on list render
		this.list.on( 'render', function () {
			this.list.store.load();
		}, this);

		// register the selection handler
		this.list.on( 'selectionchange', this.onSelect, this );
		
		// the panel containing the list
		this.listpanel = new Ext.Panel({
			items: this.list,
			layout: 'fit',
			listeners: {
				// when the list is shown, deselect all items
				activate: {
					fn: function(){
						this.list.getSelectionModel().deselectAll();
						Ext.repaint();
					},
					scope: this
				}
			}
		});

		Ext.apply( this, { items: [ this.listpanel ] } );
		
		kudos.views.PeopleListPanel.superclass.initComponent.apply( this, arguments );
	},
	
	// when a list item is pressed
	onSelect: function( selectionmodel, records ) {
		if ( records[0] != undefined ) {
			// create a UserProfilePanel
			var userProfileCard = new kudos.views.UserProfilePanel({
				// when 'back' is clicked, return to user list
				prevCard: this.listpanel,
				user: records[0],
				card: true
			});
			
			this.setActiveItem( userProfileCard, 'slide' );
		}
	}
});

Ext.reg( 'kudosPeopleList', kudos.views.PeopleListPanel );

