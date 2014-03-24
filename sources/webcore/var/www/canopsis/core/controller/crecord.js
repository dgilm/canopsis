define([
	'jquery',
	'app/lib/ember',
	'app/application',
	'app/model/crecord'
], function($, Ember, Application, Account) {

	Application.CrecordController = Ember.ObjectController.extend({
	});

	return Application.CrecordController;
});