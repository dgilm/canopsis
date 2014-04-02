define([
	'jquery',
	'app/lib/ember',
	'app/application',
	'app/controller/crecordform'
], function($, Ember, Application, CrecordformController) {
	Application.CrecordformView = Ember.View.extend({
		//Controller -> View Hooks
		registerHooks: function() {
			this.get("controller").on('validate', this, this.hidePopup);
		},

		unregisterHooks: function() {
			this.get("controller").off('validate', this, this.hidePopup);
		},

		//Ember native events
		didInsertElement : function(){
			this._super();

			this.registerHooks();

			Ember.run.scheduleOnce('afterRender', this, function(){
				this.showPopup();
			});
		},

		willClearRender: function() {
			this.unregisterHooks();
		},

		//regular methods
		showPopup: function() {
			$("#crecordform-modal").modal();
		},
		hidePopup: function() {
			console.log("view hidePopup");
			$("#crecordform-modal").modal("hide");
		}
	});

	return Application.CrecordformView;
});