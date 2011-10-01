kudos.views.UserProfilePanel = Ext.extend( kudos.views.KudoCardPanel, {
	layout: 'vbox',
	cls: 'user-profile',
	card: false,

	scroll: 'vertical',

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
					'<p>Kudos Sent: {kudos.sent} <span class="count-spacer">Kudos Received : {kudos.received}</span></p>',
				'</div>'
			)
		});

		items.push( user_header );

		var uid = kudos.data.uid;

		//TODO: fix up the parsing of the User JSON so that kudos.sent and kudos.received are correct
		if ( this.user ) {
			uid = this.user.raw._id;
			user_header.data = this.user.raw;
		}
		
		// add a Send Kudo button if this is not the current user
		if ( !this.me ) {			
			var first_name = this.user.data.name.substring( 0, this.user.data.name.indexOf( ' ' ) );
			var send_kudos_button = {
				xtype: 'button',
				ui: 'decline',
				html: '<div class="suitcase"></div><span class="x-button-label">Give ' + first_name + ' a Kudo</span>',
				scope: this,
				width: '98%',
				height: 43,
				cls: 'send-kudo',
				handler: function () {

					var sendKudoPanel = new kudos.views.SendKudoPanel({
						user : this.user
					});
					
					this.ownerCt.setActiveItem( sendKudoPanel, {
						type: 'slide',
						direction: 'up',
						scope: this
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
						'<span class="total">+{total}</span>',
						'{data.name}',
					'</div>',
				'</tpl>'
			),
			cls: 'feedback',
			margin: '0 0 10 0'
		});

		function update_totals ( self ) {
			if ( self.categories && self.user ) {
				Ext.each( self.categories, function ( cat ) {
					if ( self.user.raw.kudos.totals ) {
						cat.total = self.user.raw.kudos.totals[ cat.raw._id ] || 0;
					} else {
						cat.total = 0;
					}
				});
				feedback_panel.update( { categories: self.categories } );
			}
		}

		kudos.stores.KudoCategory.load( function ( records, operation, success ) {
			self.categories = records;
			feedback_panel.update( { categories: self.categories } );
			update_totals( self );
		});

		items.push( feedback_panel );

		this.on( 'render', function () {
			User = Ext.ModelMgr.getModel( 'User' );
			User.load( uid, {
				success: function ( user ) {
					self.user = user;
					user_header.update( self.user.data );
					update_totals( self );
				}
			});
		});

		var store_filter = function ( record ) {
			return record.get( 'sender' )._id === uid ||
				   record.get( 'recipient' )._id === uid;
		};

		var activity = new kudos.views.ActivityPanel({
			stores: [ [ kudos.stores.Kudo, 'kudo' ] ],
			store_filter: store_filter,
			no_load: true,
			no_select: true,
			no_tap: true,
			show_snippet: true,
			width: '98%',
			margin: '10 0 10 0',
			scroll: false
		});

		items.push( activity );

		// a spacer
		items.push({
			height: 20
		});

		Ext.apply( this, {
			items: items,
			defaults: defaults
		});

		kudos.views.UserProfilePanel.superclass.initComponent.apply( this, arguments );
	}
});

Ext.reg('kudosUserProfile', kudos.views.UserProfilePanel);
