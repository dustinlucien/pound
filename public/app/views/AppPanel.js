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
