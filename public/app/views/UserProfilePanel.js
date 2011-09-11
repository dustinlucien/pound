kudos.views.UserProfilePanel = Ext.extend( kudos.views.KudoCardPanel, {
	layout: 'vbox',
	cls: 'user-profile',
	card: false,

	// two variables used in this class.
	// `this.user` is a user record that has been passed in on creation
	// `this.card` is a boolean signifying is this should be a navigable card, or a single panel.
	
	initComponent: function() {		

		var self = this;

		// determine whether this panel is for the
		// current user
		if ( ( this.user == undefined ) || ( this.user.getId() == kudos.data.uid ) ) {
			this.me = true;
		} else {
			this.me = false;
		}
		
		var user_header = new Ext.Component({
			tpl: new Ext.XTemplate(
				'<div>',
					'<h2 class="user-name link-text">{name}</h2>',
					'<p>Kudos Sent: {kudos.sent.length} <span class="count-spacer">Kudos Received : {kudos.received.length}</span></p>',
				'</div>'
			),
			width: '100%',
			margin: '10'
		});
		
		//TODO: fix up the parsing of the User JSON so that kudos.sent and kudos.received are correct
		if ( this.user ) {
			user_header.data = this.user.raw;
		} else {
			this.on( 'render', function () {
				User = Ext.ModelMgr.getModel( 'User' );
				User.load( kudos.data.uid, {
					success: function ( user ) {
						console.log( 'successful data load of logged in user' );
						self.user = user;
						user_header.update( self.user.data );
					}
				});
			});
		}
		
		// add a Send Kudo button if this is not the current user
		if ( !this.me ) {			
			var send_kudos_button = {
				xtype: 'button',
				ui: 'decline',
				text: 'Give ' + this.user.data.name + ' a Kudo',
				margin: '20 0',
				scope: this,
				handler: function () {

					var sendKudoPanel = new kudos.views.SendKudoPanel({
						user : this.user
					});
					
					this.ownerCt.setActiveItem( sendKudoPanel, {
						type: 'slide',
						direction: 'up',
						scope: this,
						after: function() {
							this.destroy();
						}
					});
				}
			};
			
			Ext.apply(this, {items : [ user_header, send_kudos_button ]});
		} else {
			Ext.apply(this, {items : [ user_header ]});
		}
		
		kudos.views.UserProfilePanel.superclass.initComponent.apply( this, arguments );
	}
});

Ext.reg('kudosUserProfile', kudos.views.UserProfilePanel);
