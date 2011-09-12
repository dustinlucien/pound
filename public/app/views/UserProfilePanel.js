kudos.views.UserProfilePanel = Ext.extend( kudos.views.KudoCardPanel, {
	layout: 'vbox',
	cls: 'user-profile',
	card: false,

	// two variables used in this class.
	// `this.user` is a user record that has been passed in on creation
	// `this.card` is a boolean signifying is this should be a navigable card, or a single panel.
	
	initComponent: function() {		

		var self = this,

			items = [],

			defaults = {
				width: '98%',
				margin: '10 0'
			};

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
			)
		});

		items.push( user_header );
		
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
				scope: this,
				width: '98%',
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
			
			items.push( send_kudos_button );
		}

		items.push({
			html: 'Feedback received',
			margin: '10 0 0 0'
		});

		var feedback_panel = new Ext.Component({
			tpl: new Ext.XTemplate(
				'<tpl for="categories">',
					'<div class="category">',
						'<span class="total">+0</span>',
						'{data.name}',
					'</div>',
				'</tpl>'
			),
			cls: 'feedback',
			margin: '0 0 10 0'
		});

		kudos.stores.KudoCategory.load( function ( records, operation, success ) {
			feedback_panel.update( { categories: records } );
		});

		items.push( feedback_panel );

		Ext.apply( this, {
			items: items,
			defaults: defaults
		});

		kudos.views.UserProfilePanel.superclass.initComponent.apply( this, arguments );
	}
});

Ext.reg('kudosUserProfile', kudos.views.UserProfilePanel);
