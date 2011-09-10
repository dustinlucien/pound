kudos.views.KudoDetailPanel = Ext.extend( kudos.views.KudoCardPanel, {
	layout: 'vbox',
	cls: 'kudo-detail',
	card: false,

	// two variables used in this class.
	// `this.kudo` is a kudo record that has been passed in on creation
	// `this.card` is a boolean signifying is this should be a navigable card, or a single panel.
	
	initComponent: function() {		

		var self = this;

		Ext.apply( this, {
			items: [{
				html: this.kudo.raw.message
			}]
		});
		
		kudos.views.KudoDetailPanel.superclass.initComponent.apply( this, arguments );
	}
});

Ext.reg('kudosKudoDetail', kudos.views.KudoDetailPanel);

