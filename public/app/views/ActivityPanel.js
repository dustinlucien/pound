kudos.views.ActivityPanel = Ext.extend( Ext.List, {

	cls: 'feed-list',
	selectedItemCls: undefined,

	initComponent: function () {

		var self = this;

		var tpl = new Ext.XTemplate(
			'<div class="feed-item {[xindex % 2 === 0 ? "even" : "odd"]}">',
				'<tpl if="type === \'kudo\'">',
					'<tpl for="item">',
					'<tpl if="sender._id === kudos.data.uid">You gave </tpl>',
					'<tpl if="sender._id !== kudos.data.uid"><span class="link-text" data-uid="{sender._id}">{sender.name}</span> gave </tpl>',
					'<tpl if="recipient._id === kudos.data.uid">you a kudo</tpl>',
					'<tpl if="recipient._id !== kudos.data.uid"><br /><span class="link-text" data-uid="{recipient._id}">{recipient.name}</span> a kudo</tpl>',
					'<tpl if="this.showSnippet()">',
						'<div class="kudo-snippet">for {message}</div>',
					'</tpl>',
					'</tpl>',
				'</tpl>',
			'</div>',
			{
				showSnippet: function () {
					return self.show_snippet || false;
				}
			}
		);

		var store = new Ext.data.Store({
			model: 'FeedItem'
		});

		Ext.apply( this, {
			itemTpl: tpl,
			store: store
		});

		// on render, load activity
		this.on( 'show', this.loadItems );
		this.on( 'render', this.loadItems );

		this.on( 'selectionchange', this.onSelect, this );

		kudos.views.ActivityPanel.superclass.initComponent.apply( this, arguments );
	},

	loadItems: function () {
		var feedStore = this.store;
		// remove all store data
		feedStore.loadData( [], false );
		// iterate over stores
		Ext.each( this.stores, function ( storeDef ) {
			var store = storeDef[ 0 ],
				type = storeDef[ 1 ];
			// load the store data
			store.load( function ( records ) {
				var data = [];
				// push all records onto an array
				// (as a FeedItem)
				Ext.each( records, function ( record ) {
					var raw = record.raw;
					data.push({
						_id: raw._id,	
						created: new Date( raw.created ),
						type: type,
						item: raw
					});
				});

				// append the data into the store
				feedStore.loadData( data, true );
				// sorted everything by created date
				feedStore.sort( 'created' );
			});
		});
	},

	onTap: function ( eventObj ) {
		var target = eventObj.getTarget(),
			self = this;

		if ( this.no_tap ) {
			eventObj.stopPropagation();
		} else if ( target.tagName === 'SPAN' ) {
			var uid = target.attributes.getNamedItem( 'data-uid' ).value;
			kudos.models.User.load( uid, {
				success: function ( user ) {
					var userProfileCard = new kudos.views.UserProfilePanel({
						user: user,
						card: true,
						prevCard: self
					});

					self.ownerCt.setActiveItem( userProfileCard, {
						type: 'slide',
						direction: 'left'
					});
				}
			});
			eventObj.stopPropagation();
		}
	},

	onKudoSelect: function ( kudo ) {
		var self = this;

		if ( kudo.get( 'parent' ) ) {
			kudos.models.Kudo.load( kudo.get( 'parent' ), {
				success: function ( kudo ) {
					create_card.call( self, kudo );
				}
			});
		} else {
			create_card.call( self, kudo );
		}

		function create_card ( kudo ) {
			var kudoDetailCard = new kudos.views.KudoDetailPanel({
				kudo: kudo,
				card: true,
				prevCard: self 
			});

			this.ownerCt.setActiveItem( kudoDetailCard, {
				type: 'slide',
				direction: 'left'
			});
		}
	},

	// when an item is pressed
	onSelect: function ( selectionmodel, records ) {
		if ( ( ! this.no_select ) && records[ 0 ] ) {
			var self = this,
				item = records[ 0 ];

			if ( item.get( 'type' ) === 'kudo' ) {
				var kudo_item = item.get( 'item' );
				this.onKudoSelect( new kudos.models.Kudo( item.get( 'item' ) ) );
			}
		}
	}

});

Ext.reg('kudosActivityPanel', kudos.views.ActivityPanel);

