define([
	'jquery',
	'app/lib/ember',
	'app/application',
	'app/model/userview'
], function($, Ember, Application, Selector) {
	Application.UserviewsRoute = Application.AuthenticatedRoute.extend({
		setupController: function(controller, model) {
			controller.set('content', model);
			controller.set('toolitems', controller.toolbar);
		},

		model: function() {
			return this.store.findAll('userview');
		}
	});

	Application.UserviewsController = Application.CrecordsController.extend({});

	return Application.UserviewsController;
});