kudos.views.KudoDetailPanel = Ext.extend( kudos.views.KudoCardPanel, {
	layout: 'vbox',
	cls: 'kudo-detail',
	card: false,

	scroll: 'vertical',

	// two variables used in this class.
	// `this.kudo` is a kudo record that has been passed in on creation
	// `this.card` is a boolean signifying is this should be a navigable card, or a single panel.
	
	initComponent: function() {		

		var self = this,
			message = 'This is a Kudo for ' + this.kudo.get( 'message' );

		var cat_box = [ '<div class="cat-box">',
						this.kudo.get( 'category' ).name,
						'<br />',
						'+1',
						'</div>' ].join( '' );

		var user = new kudos.models.User( self.kudo.get( 'recipient' ) );
		var add_button = {
			xtype: 'button',
			ui: 'decline',
			html: '<div class="suitcase"></div><span class="x-button-label">Add your Kudo</span>',
			width: '98%',
			height: 43,
			cls: 'send-kudo',
			handler: function () {
				var sendKudoPanel = new kudos.views.SendKudoPanel({
					user : user,
					parent: self.kudo
				});

				self.ownerCt.setActiveItem( sendKudoPanel, {
					type: 'slide',
					direction: 'up',
					scope: self
				});
			}
		};

		var glom_filter = function ( record ) {
			return record.get( 'parent' ) === self.kudo.get( '_id' );
		};

		var activity = new kudos.views.ActivityPanel({
			stores: [ [ kudos.stores.Kudo, 'kudo' ] ],
			store_filter: glom_filter,
			no_load: true,
			no_select: true,
			no_tap: true,
			show_snippet: true,
			width: '98%',
			margin: '10 0 10 0',
			scroll: false
		});

		var msg = {
			html: 'Other Kudos in this spree',
			margin: '10 0 10 0',
			width: '98%'
		};

		Ext.apply( this, {
			items: [{
				html: '<div class="big glow-suitcase"></div>',
				margin: '10 0 10 0'
			},{
				html: message,
				padding: '5'
			},{
				html: cat_box,
				margin: '10',
				width: '100%'
			},
			msg,
			activity,
			// a spacer
			{
				height: 20
			}]
		});

		kudos.views.KudoDetailPanel.superclass.initComponent.apply( this, arguments );

		function insert_add_button ( insert ) {
			if ( insert &&
				 ( self.kudo.get( 'sender' )._id !== kudos.data.uid ) &&
				 ( self.kudo.get( 'recipient' )._id !== kudos.data.uid ) ) {
				self.insert( 3, add_button );
				self.doLayout();
			}
		}
	}
});

Ext.reg('kudosKudoDetail', kudos.views.KudoDetailPanel);

