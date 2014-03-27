define([
	'jquery',
	'app/lib/ember',
	'app/application',
	'app/model/account'
], function($, Ember, Application, Account) {
	Application.AccountsRoute = Application.CrecordsRoute.extend({
		setupController: function(controller, model) {
			controller.set('content', model);
			controller.set('toolitems', controller.toolbar);
		},

		model: function() {
			return this.store.findAll('account');
		}
	});

	Application.AccountsController = Application.CrecordsController.extend({});

	return Application.AccountsController;
});