define([
	'jquery',
	'app/lib/ember',
	'app/application',
	'app/model/userview'
], function($, Ember, Application, Userview) {

	Application.UserviewController = Ember.ObjectController.extend({
	});

	return Application.UserviewController;
});
