kudos.views.KudoDetailPanel = Ext.extend( Ext.Panel, {
	layout: 'vbox',
	cls: 'kudo-detail',
	card: false,

	// two variables used in this class.
	// `this.kudo` is a kudo record that has been passed in on creation
	// `this.card` is a boolean signifying is this should be a navigable card, or a single panel.
	
	initComponent: function() {		

		var self = this;

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

		var toolbar = {
			xtype: 'toolbar',
			items: [{
				text: 'Back',
				ui: 'back',
				handler: this.back
			}]
		};

		Ext.apply( this, {
			dockedItems: [ toolbar ],
			items: [{
				html: this.kudo.raw.message
			}]
		});
		
		kudos.views.KudoDetailPanel.superclass.initComponent.apply( this, arguments );
	}
});

Ext.reg('kudosKudoDetail', kudos.views.KudoDetailPanel);

