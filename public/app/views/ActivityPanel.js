kudos.views.ActivityPanel = Ext.extend( Ext.List, {

	store: 'kudoStore',
	cls: 'kudo-list',

	initComponent: function () {

		var tpl = new Ext.XTemplate(
			'<div class="kudo-item {[xindex % 2 === 0 ? "even" : "odd"]}">',
				'<tpl if="sender._id === kudos.data.uid">You gave </tpl>',
				'<tpl if="sender._id !== kudos.data.uid"><span class="link-text" data-uid="{sender._id}">{sender.name}</span> gave </tpl>',
				'<tpl if="recipient._id === kudos.data.uid">you a kudo</tpl>',
				'<tpl if="recipient._id !== kudos.data.uid"><br /><span class="link-text" data-uid="{recipient._id}">{recipient.name}</span> a kudo</tpl>',
			'</div>'
		);

		Ext.apply( this, {
			itemTpl: tpl
		});

		// on render, load activity
		this.on('render', function() {
			this.store.load();
		});

		// register the selection handler
		this.on( 'selectionchange', this.onSelect, this );

		// on item tap
		this.on( 'itemtap', this.onTap, this );
		
		kudos.views.ActivityPanel.superclass.initComponent.apply( this, arguments );
	},

	onTap: function ( eventObj ) {
		var target = eventObj.getTarget(),
			self = this;
		if ( target.tagName === 'SPAN' ) {
			var uid = target.attributes.getNamedItem( 'data-uid' ).value;
			kudos.models.User.load( uid, {
				success: function ( user ) {
					var userProfileCard = new kudos.views.UserProfilePanel({
						user: user,
						card: true,
						prevCard: self
					});

					self.ownerCt.setActiveItem( userProfileCard, {
						type: 'slide',
						direction: 'left'
					});
				}
			});
			eventObj.stopPropagation();
		}
	},

	// when an item is pressed
	onSelect: function ( selectionmodel, records ) {
		if ( records[ 0 ] ) {
			var self = this;

			var kudoDetailCard = new kudos.views.KudoDetailPanel({
				kudo: records[ 0 ],
				card: true,
				prevCard: self
			});

			this.ownerCt.setActiveItem( kudoDetailCard, {
				type: 'slide',
				direction: 'left'
			});
		}
	}

});

Ext.reg('kudosActivityPanel', kudos.views.ActivityPanel);

