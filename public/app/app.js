// registering our app creates a global `kudos` object that has `models`,
// `views`, and `controllers` properties (and other methods and properties)
Ext.regApplication({
	// the name of the app
	name: 'kudos',

	// this function is called when the app is ready to launch
	launch: function () {
		// dispatch to the Login controller to check whether the user
		// is logged in and determine which panel to load
		Ext.dispatch({
			controller: 'Login',
			action: 'test_session'
		});
	}
});
