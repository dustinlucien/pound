kudos.views.ActivityPanel = Ext.extend( Ext.List, {

	store: 'Kudo',
	cls: 'kudo-list',

	initComponent: function () {

		var tpl = new Ext.XTemplate(
			'<div class="kudo-item {[xindex % 2 === 0 ? "even" : "odd"]}">',
				'<tpl if="sender === kudos.data.uid">You gave </tpl>',
				'<tpl if="sender !== kudos.data.uid"><span class="link-text">{sender_name}</span> gave </tpl>',
				'<tpl if="recipient === kudos.data.uid">you a kudo</tpl>',
				'<tpl if="recipient !== kudos.data.uid"><br /><span class="link-text">{recipient_name}</span> a kudo</tpl>',
			'</div>'
		);

		Ext.apply( this, {
			itemTpl: tpl
		});

		kudos.views.ActivityPanel.superclass.initComponent.apply( this, arguments );
	}

});

Ext.reg('kudosActivityPanel', kudos.views.ActivityPanel);