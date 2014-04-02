define(['app/lib/ember', 'app/application'], function(Ember, Application) {
	Application.ApplicationRoute = Application.AuthenticatedRoute.extend({
		model: function() {
			var fixture_widget = this.store.createRecord("timegraph", { "name": "uv1"});
			return {
				title: 'Canopsis',
				fixture_widget: fixture_widget
			};
		}
	});

	Application.ApplicationController = Ember.ObjectController.extend({
		needs: ['login'],

		actions: {
			openTab: function(url) {
				this.transitionToRoute(url);
			},

			logout: function() {
				this.get('controllers.login').setProperties({
					'authkey': null,
					'errors': []
				});

				this.transitionToRoute('/login');
			}
		}
	});

	return Application.ApplicationController;
});