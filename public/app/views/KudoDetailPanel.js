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
			message = 'This is a Kudo for ' + this.kudo.raw.message;

		var cat_box = [ '<div class="cat-box">',
						this.kudo.raw.category.name,
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
			// a spacer
			{
				height: 20
			}]
		});

		kudos.views.KudoDetailPanel.superclass.initComponent.apply( this, arguments );

		if (  ( this.kudo.get( 'sender' )._id !== kudos.data.uid ) &&
			  ( this.kudo.get( 'recipient' )._id !== kudos.data.uid ) ) {
			this.insert( 3, add_button );
		}

		Ext.Ajax.request({
			url: '/kudos/' + this.kudo.getId() + '/gloms',
			success: function ( response ) {
				var body = Ext.decode( response.responseText );
				if ( body.success ) {
					var glomStore = new Ext.data.Store({
						model: kudos.models.Kudo,
						data: body.response.kudos.items
					});
	
					var activity = new kudos.views.ActivityPanel({
						cls: 'kudo-list',
						store: glomStore,
						no_load: true,
						width: '98%',
						margin: '10 0 10 0',
						scroll: false
					});
					self.insert( 3, activity );
					self.doLayout();
				}
			}
		});
	}
});

Ext.reg('kudosKudoDetail', kudos.views.KudoDetailPanel);

