kudos.views.SectionsPanel = Ext.extend( Ext.Panel, {
	// panel config
	layout: 'card',

	initComponent: function () {

		var item_pos = {
			'You': 0,
			'Activity': 1,
			'People': 2,
			'Settings': 3
		},

		current_item = 1,
		self = this;

		function section_button_handler ( button ) {
			var button_pos = item_pos[ button.text ],
				dir = button_pos < current_item ? 'right' : 'left';

			if ( button_pos !== current_item ) {
				current_item = button_pos;
				self.setActiveItem( button_pos, {
					type: 'slide',
					direction: dir
				});
			}
		}

		var buttons = this.buttons = new Ext.SegmentedButton({
			allowPress: true,
			width: '100%',
			defaults: { handler: section_button_handler, flex: 1 },
			items: [{
				text: 'You'
			},{
				text: 'Activity',
				pressed: true
			},{
				text: 'People'
			},{
				text: 'Settings'
			}]
		});

		var dockedItems = [{
			xtype: 'toolbar',
			dock: 'bottom',
			items: [ buttons ]
		}];

		kudos.views.activity_panel = new kudos.views.ActivityPanel({
			stores: [ [ kudos.stores.Kudo, 'kudo' ] ]
		});

		empty = new kudos.views.EmptyPanel();
		kudos.views.user_profile_panel = new kudos.views.UserProfilePanel();
		kudos.views.people_list_panel = new kudos.views.PeopleListPanel();

		Ext.apply( this, {
			dockedItems: dockedItems,
			activeItem: 1,
			items: [ kudos.views.user_profile_panel, kudos.views.activity_panel, kudos.views.people_list_panel, empty ]
		});
		
		// always call the super method...
		kudos.views.SectionsPanel.superclass.initComponent.apply( this, arguments );
	},
	
	reloadActivityStream: function() {
		var self = this;
		self.setActiveItem( 1, {
			type: 'slide',
			direction: 'left'
		});
	}
});

Ext.reg('kudosSectionsPanel', kudos.views.SectionsPanel);
