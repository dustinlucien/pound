kudos.views.SendKudoPanel = Ext.extend( Ext.Panel, {
	// let items take up all available width and their required height
	layout: 'fit',

	initComponent: function () {

		var html_message = {
			html: 'This is a Kudo for',
			padding: '0 0 0 5'
		};

		var fieldset_message = {
			xtype: 'fieldset',
			margin: '10 0 10 0',
			items: [{
				xtype: 'textareafield',
				name: 'message',
				placeHolder: 'working late...'
			}]
		};

		var html_category = {
			html: 'And it\'s all because this person',
			padding: '0 0 10 5'
		};

		var send_button = {
			xtype: 'button',
			ui: 'decline',
			text: 'Send this Kudo',
			margin: '20 0',
			scope: this,
			handler: function () {
				Ext.dispatch({
					controller: 'Kudo',
					action: 'send',
					body_panel: this._body_panel,
					cat_buttons: this._cat_buttons,
					view: this
				});
			}
		};

		var hidden_recipient = {
			xtype: 'hiddenfield',
			name: 'recipient',
			value: this.user.getId()
		};
		
		// TODO indicate that categories are loading
		var body_panel = new kudos.views.KudosFormPanel({
			items: [
				html_message,
				fieldset_message,
				html_category,
				send_button,
				hidden_recipient
			]
		});

		Ext.apply( this, {
			items: [ body_panel ],
			_body_panel: body_panel
		});

		kudos.views.SendKudoPanel.superclass.initComponent.apply( this, arguments );

		// TODO move this stuff vv somewhere else and make it perdy

		var cat_handler = function ( button ) {
			Ext.dispatch({
				controller: 'Kudo',
				action: 'select_category',
				args: [ button ],
				body_panel: this._body_panel,
				cat_buttons: this._cat_buttons
			});
		};

		var cat_row = {
			xtype: 'panel',
			layout: 'hbox',
			margin: '0 0 10 0',
			defaults: { handler: cat_handler },
		};

		var cat = {
			cls: 'bright-blue white-text small-text',
			flex: 1
		};

		var cat_buttons = this._cat_buttons = [];

		var kudoCategoryStore = Ext.StoreMgr.lookup('kudoCategoryStore');
		
		kudoCategoryStore.load({
			// TODO error handling...
			callback: function ( records ) {
				var current_row = Ext.apply( { items: [] }, cat_row ),
					current_cat,
					index = 5;

				// TODO only works on even # of categories...
				for ( var i = 0, l = records.length; i < l; i++ ) {
					current_cat = Ext.apply({
						text: records[ i ].get( 'description' ),
						_cat_id: records[ i ].get( '_id' ),
					}, cat );

					current_cat = new Ext.Button( current_cat );

					current_row.items.push( current_cat );
					cat_buttons.push( current_cat );

					if ( i % 2 === 0 ) {
						current_row.items.push( { xtype: 'spacer', width: 10 } );
					} else {
						body_panel.insert( index, current_row );
						index += 1;
						current_row = Ext.apply( { items: [] }, cat_row );
					}
				}

				body_panel.doLayout();
			}
		});
	}


/*
					xtype: 'panel',
					layout: 'hbox',
					margin: '0 0 10 0',
					items: [{
						xtype: 'button',
						text: 'is a braniac',
						cls: 'bright-blue white-text',
						flex: 1
					},{
						xtype: 'spacer',
						width: 10
					},{
						xtype: 'button',
						text: 'kept us calm',
						cls: 'bright-blue white-text',
						flex: 1
					}]
				},{
					xtype: 'panel',
					layout: 'hbox',
					margin: '0 0 10 0',
					items: [{
						xtype: 'button',
						text: 'closed the deal',
						cls: 'bright-blue white-text',
						flex: 1
					},{
						xtype: 'spacer',
						width: 10
					},{
						xtype: 'button',
						text: 'had the answer',
						cls: 'bright-blue white-text',
						flex: 1
					}]
				},{
					xtype: 'panel',
					layout: 'hbox',
					margin: '0 0 10 0',
					items: [{
						xtype: 'button',
						text: 'knew what to say',
						cls: 'bright-blue white-text',
						flex: 1
					},{
						xtype: 'spacer',
						width: 10
					},{
						xtype: 'button',
						text: 'chipped in',
						cls: 'bright-blue white-text',
						flex: 1
					}]
				}
			]
		})
	]
*/
	
});

