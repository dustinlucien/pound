kudos.views.ActivityPanel = Ext.extend( Ext.List, {

	store: 'Kudo',

	initComponent: function () {

		var tpl = new Ext.XTemplate(
			'<div class="kudo-item">',
				'<tpl if="sender === kudos.data.uid">You gave </tpl>',
				'<tpl if="sender !== kudos.data.uid">{sender_name} gave </tpl>',
				'<tpl if="recipient === kudos.data.uid">you a kudo</tpl>',
				'<tpl if="recipient !== kudos.data.uid"><br />{recipient_name} a kudo</tpl>',
			'</div>'
		);

		Ext.apply( this, {
			itemTpl: tpl
		});

		kudos.views.ActivityPanel.superclass.initComponent.apply( this, arguments );
	}

});
