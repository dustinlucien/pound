// this is the main viewport for the app. it extends the Ext.Panel
// component 
kudos.views.ViewPort = Ext.extend( Ext.Panel, {
	// config options for the panel
	fullscreen: true,
	layout: 'card',
	activeItem: 0,
	html: 'base'
});
