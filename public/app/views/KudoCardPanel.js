kudos.views.KudoCardPanel = Ext.extend( Ext.Panel, {

	initComponent: function () {

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
	
		kudos.views.KudoCardPanel.superclass.initComponent.apply( this, arguments );
	}

});
