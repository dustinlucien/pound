kudos.views.ActivityPanel = Ext.extend( Ext.List, {

	store: 'kudoStore',
	cls: 'kudo-list',

	initComponent: function () {

		var tpl = new Ext.XTemplate(
			'<div class="kudo-item {[xindex % 2 === 0 ? "even" : "odd"]}">',
				'<tpl if="sender._id === kudos.data.uid">You gave </tpl>',
				'<tpl if="sender._id !== kudos.data.uid"><span class="link-text">{sender.name}</span> gave </tpl>',
				'<tpl if="recipient._id === kudos.data.uid">you a kudo</tpl>',
				'<tpl if="recipient._id !== kudos.data.uid"><br /><span class="link-text">{recipient.name}</span> a kudo</tpl>',
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
		
		kudos.views.ActivityPanel.superclass.initComponent.apply( this, arguments );
	},

	// when an item is pressed
	onSelect: function ( selectionmodel, records ) {
		if ( records[ 0 ] ) {
			var self = this;

			var kudoDetailCard = new kudos.views.KudoDetailPanel({
				kudo: records[ 0 ],
				back: function () {
					self.ownerCt.setActiveItem( self );
					kudoDetailCard.destroy();
				}
			});

			this.ownerCt.setActiveItem( kudoDetailCard );
		}
	}

});

Ext.reg('kudosActivityPanel', kudos.views.ActivityPanel);

