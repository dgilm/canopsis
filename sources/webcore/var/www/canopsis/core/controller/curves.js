define([
	'jquery',
	'app/lib/ember',
	'app/application',
	'app/model/curve'
], function($, Ember, Application, Curve) {
	Application.CurvesRoute = Application.CrecordsRoute.extend({
		setupController: function(controller, model) {
			controller.set('content', model);
			controller.set('toolitems', controller.toolbar);
		},

		model: function() {
			return this.store.findAll('curve');
		}
	});

	Application.CurvesController = Application.CrecordsController.extend({
		toolbar: [{
			title: 'Refresh',
			action: 'refresh',
			icon: 'refresh'
		},{
			title: 'Add',
			action: 'showAddForm',
			icon: 'plus-sign'
		},{
			title: 'Duplicate',
			action: 'duplicate',
			icon: 'file'
		},{
			title: 'Remove',
			action: 'remove',
			icon: 'trash'
		}],

		actions: {
			refresh: function() {
				controller.set('content', this.store.findAll('curve'));
			}
		}
	});

	return Application.CurvesController;
});