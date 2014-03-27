define([
	'jquery',
	'app/lib/ember',
	'app/application',
	'app/model/perfdata'
], function($, Ember, Application, Perfdata) {
	Application.PerfdatasRoute = Application.CrecordsRoute.extend({
		setupController: function(controller, model) {
			controller.set('content', model);
			controller.set('toolitems', controller.toolbar);

		},

		model: function() {
			return this.store.findAll('perfdata');
		}
	});

	Application.PerfdatasController = Application.CrecordsController.extend({
		toolbar: [{
			title: 'Refresh',
			action: 'refresh',
			icon: 'refresh'
		},{
			title: 'Remove',
			action: 'remove',
			icon: 'trash'
		}],

		actions: {
			refresh: function() {
				controller.set('content', this.store.findAll('perfdata'));
			},
		}
	});

	return Application.PerfdatasController;
});