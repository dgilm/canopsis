define([
	'jquery',
	'app/lib/ember',
	'app/application',
	'app/model/group'
], function($, Ember, Application, Group) {
	Application.GroupsRoute = Application.AuthenticatedRoute.extend({
		setupController: function(controller, model) {
			controller.set('content', model);
			controller.set('toolitems', controller.toolbar);
		},

		model: function() {
			return this.store.findAll('group');
		}
	});

	Application.GroupsController = Application.CrecordsController.extend({
		toolbar: [{
			title: 'Refresh',
			action: 'refresh',
			icon: 'refresh'
		},{
			title: 'Add',
			action: 'add',
			icon: 'plus-sign'
		},{
			title: 'Remove',
			action: 'remove',
			icon: 'trash'
		}],

		actions: {
			refresh: function() {
				this.set('content', this.store.findAll('group'));
			}
		}
	});

	return Application.GroupsController;
});