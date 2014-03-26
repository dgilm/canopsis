define([
	'jquery',
	'app/lib/ember',
	'app/application',
	'app/model/crecord'
], function($, Ember, Application, CrecordModel) {

	Application.CrecordformController = Ember.ArrayController.extend({
		actions: {
			addRecord: function() {
				console.log("addRecord");
				console.log(Application.Router.router.currentHandlerInfos);
				var mainCrecordController = Application.Router.router.currentHandlerInfos[2].handler.controller;
				mainCrecordController.send('addRecord', this.crecord_type, this.get('model'));
			}
		}
	});

	return Application.CrecordformController;
});