kudos.views.UserProfilePanel = Ext.extend( Ext.Panel, {
	// let items take up all available with and their required height
	layout: 'fit',
	cls: 'user-profile',
	
	initComponent: function() {		
		console.log('logged in user id ' + kudos.data.uid);
		
		var cmp = new Ext.Component({
			tpl: new Ext.XTemplate(
				'<div>',
					'<h2 class="user-name">My name is {name}</h2>',
					'<p>and my email address is {email}',
					'<p>The beginning of the User profile page</p>',
				'</div>'
			),
			styleHtmlContent: true
		}); 
		
		Ext.apply(this, {items: [cmp]});
		
		this.on('render', function() {
			User = Ext.ModelMgr.getModel('User');
			User.load(kudos.data.uid, {
		    success: function(user) {
					console.log(user);
					//using user.raw until i figure out how to parse kudos information
					cmp.update(user.raw);
		    }
			});
		});
		
		kudos.views.UserProfilePanel.superclass.initComponent.apply( this, arguments );
	}
});

Ext.reg('kudosUserProfile', kudos.views.UserProfilePanel);