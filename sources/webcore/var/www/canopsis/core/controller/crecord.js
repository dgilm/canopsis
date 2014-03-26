define([
	'jquery',
	'app/lib/ember',
	'app/application',
	'app/model/crecord'
], function($, Ember, Application, Account) {

	Application.CrecordController = Ember.ObjectController.extend({
		actions: {
			addRecord2: function() {
				console.log("test from CrecordController");
			}
		}
	});

	return Application.CrecordController;
});