//Monkeypatch for a bug in Sencha touch 1.1.0 where it doesn't append the 
//id to the rest request

Ext.override(Ext.data.RestProxy, {
	buildUrl: function(request) {
		var operation = request.operation,
		records = operation.records || [],
		record = records[0],
		format = this.format,
		url = request.url || this.url,
		id = record ? record.getId() : operation.id;


		if (this.appendId && id) {
			if (!url.match(/\/$/)) {
				url += '/';
			}
			url += id;
		}


		if (format) {
			if (!url.match(/\.$/)) {
				url += '.';
			}


			url += format;
		}
		request.url = url;

		return Ext.data.RestProxy.superclass.buildUrl.apply(this, arguments);
	}
});

kudos.views.AppPanel = Ext.extend( Ext.Panel, {

	layout: 'fit',

	initComponent: function () {
		kudos.views.app_toolbar = new Ext.Toolbar({
			title: 'Kudos',
			titleCls: 'x-toolbar-title toolbar-title-left'
		});

		kudos.views.sections_panel = new kudos.views.SectionsPanel();

		Ext.apply( this, {
			dockedItems: [ kudos.views.app_toolbar ],
			items: [ kudos.views.sections_panel ]
		});

		kudos.views.AppPanel.superclass.initComponent.apply( this, arguments );
	}

});

Ext.reg('kudosAppPanel', kudos.views.AppPanel);