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

		this.on('render', function() {
			this.store.load();
		});
		
		kudos.views.ActivityPanel.superclass.initComponent.apply( this, arguments );
	}

});

Ext.reg('kudosActivityPanel', kudos.views.ActivityPanel);