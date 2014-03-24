define([
	'jquery',
	'app/lib/ember',
	'app/application',
	'app/model/consolidation'
], function($, Ember, Application, Consolidation) {
	Application.ConsolidationsRoute = Application.AuthenticatedRoute.extend({
		setupController: function(controller, model) {
			controller.set('content', model);
			controller.set('toolitems', controller.toolbar);
		},

		model: function() {
			return this.store.findAll('consolidation');
		}
	});

	Application.ConsolidationsController = Application.CrecordsController.extend({});

	return Application.ConsolidationsController;
});