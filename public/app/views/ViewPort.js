// this is the main viewport for the app. it extends the Ext.Panel
// component 
kudos.views.ViewPort = Ext.extend( Ext.Panel, {
	// config options for the panel
	fullscreen: true,
	layout: 'card',

	// the view initialization method
	initComponent: function () {
		// instantiate panels
		kudos.views.login_panel = new kudos.views.LoginPanel();
		kudos.views.register_panel = new kudos.views.RegisterPanel();
		
		// add our view components to the viewport
		this.items = [
				kudos.views.login_panel,
				kudos.views.register_panel
			];
			
		// call the init method of the "superclass" of this component
		kudos.views.ViewPort.superclass.initComponent.apply( this, arguments );
	}
	
});
