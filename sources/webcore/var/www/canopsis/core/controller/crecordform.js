define([
	'jquery',
	'app/lib/ember',
	'app/application',
	'app/model/crecord'
], function($, Ember, Application, CrecordModel) {

	Application.CrecordformController = Ember.ArrayController.extend({

	});

	return Application.CrecordformController;
});