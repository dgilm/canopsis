define([
	'jquery',
	'app/lib/ember',
	'app/application',
	'app/controller/crecordform'
], function($, Ember, Application, CrecordformController) {
	Application.CrecordformView = Ember.View.extend({
		//Controller -> View Hooks
		registerHooks: function() {
			this.controller.on('addRecord', this, this.hidePopup);
		},
		unregisterHooks: function() {
			this.controller.off('addRecord', this, this.hidePopup);
		},

		//Ember native events
		didInsertElement : function(){
			this._super();

			this.registerHooks();

			Ember.run.scheduleOnce('afterRender', this, function(){
				this.showPopup();
			});
		},
		willClearRender: function()
		{
			this.unregisterHooks();
		},

		//regular methods
		showPopup: function() {
			$("#crecordform-modal").modal();
		},
		hidePopup: function() {
			$("#crecordform-modal").modal("hide");
		}
	});

	return Application.CrecordformView;
});