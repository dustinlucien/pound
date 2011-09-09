kudos.views.UserProfilePanel = Ext.extend( Ext.Panel, {
	layout: 'vbox',
	cls: 'user-profile',
	card: false,

	//two variables used in this class.
	//this.user is a user record that has been passed in on creation
	//this.card is a boolean signifying is this should be a navigable card, or a single panel.
	
	initComponent: function() {		
		// determine whether this panel is for the
		// current user
		if ( ( this.user == undefined ) || ( this.user.getId() == kudos.data.uid ) ) {
			this.me = true;
		} else {
			this.me = false;
		}
		
		// if this panel is being used as a card, include
		// a toolbar with a back button
		if ( this.card ) {
			this.dockedItems = [{
				xtype: 'toolbar',
				items: [{
					ui: 'back',
					text: 'Back',
					scope: this,
					handler: function () {
						// slide back to the previous card and destroy
						// this panel
						this.ownerCt.setActiveItem( this.prevCard, {
							type: 'slide',
							reverse: true,
							scope: this,
							after: function(){
								this.destroy();
							}
						});
					}
				}]
			}]; 
		}
		
		var user_profile_cmp = new Ext.Component({
			tpl: new Ext.XTemplate(
				'<div>',
					'<h2 class="user-name">My name is {name}</h2>',
					'<p>Kudos Sent: {kudos.sent.length} Kudos Received : {kudos.received.length}</p>',
					'<p>The beginning of the User profile page</p>',
				'</div>'
			),
			styleHtmlContent: true
		});
		
		//TODO: fix up the parsing of the User JSON so that kudos.sent and kudos.received are correct
		if ( this.user ) {
			user_profile_cmp.data = this.user.raw;
		} else {
			var self = this;
			this.on( 'render', function () {
				User = Ext.ModelMgr.getModel( 'User' );
				User.load( kudos.data.uid, {
					success: function ( user ) {
						console.log( 'successful data load of logged in user' );
						self.user = user;
						user_profile_cmp.update( self.user.data );
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
					var sendKudoPanel = new kudos.views.SendKudoPanel({ user : this.user });
					
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
			
			Ext.apply(this, {items : [ user_profile_cmp, send_kudos_button ]});
		} else {
			Ext.apply(this, {items : [ user_profile_cmp ]});
		}
		
		kudos.views.UserProfilePanel.superclass.initComponent.apply( this, arguments );
	}
});

Ext.reg('kudosUserProfile', kudos.views.UserProfilePanel);
