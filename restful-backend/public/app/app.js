// registering our app creates a global `kudos` object that has `models`,
// `views`, and `controllers` properties (and other methods and properties)
Ext.regApplication({
	// the name of the app
	name: 'kudos',

	// this function is called when the app is ready to launch
	launch: function () {
		// define the default viewport as an instance of the class
		// kudos.views.ViewPort (defined in the views folder)
		this.views.viewport = new this.views.ViewPort();
	}
});
