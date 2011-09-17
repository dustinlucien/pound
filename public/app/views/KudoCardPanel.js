kudos.views.KudoCardPanel = Ext.extend( Ext.Panel, {

	initComponent: function () {

		// if this panel is being used as a card, include
		// a toolbar with a back button
		if ( this.card ) {

			var self = this,
				toolBar = kudos.views.app.dockedItems.get( 0 );

			toolBar.add({
				xtype: 'toolbar',
				items: [{
					ui: 'back',
					text: 'Back',
					scope: self,
					handler: function () {

						toolBar.removeAll( true );

						// slide back to the previous card and destroy
						// this panel
						self.ownerCt.setActiveItem( self.prevCard, {
							type: 'slide',
							reverse: true,
							scope: self,
							after: function(){
								self.destroy();
							}
						});
					}
				}]
			}); 

			toolBar.doLayout();
		}
	
		kudos.views.KudoCardPanel.superclass.initComponent.apply( this, arguments );
	}

});
