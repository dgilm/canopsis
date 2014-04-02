define([
	'jquery',
	'app/lib/ember',
	'app/lib/ember-data',
	'seeds/RoutesLoader',
	'text!app/manifest.json',
	'jsonselect'
], function($, Ember, DS, routesLoader, manifest) {
	manifest = JSON.parse(manifest);


	var Application = Ember.Application.create({
		manifest: manifest
	});

	Application.register("transform:array", DS.ArrayTransform);

	Application.AuthenticatedRoute = Ember.Route.extend({
		beforeModel: function(transition) {
			if(!this.controllerFor('login').get('authkey')) {
				this.loginRequired(transition);
			}
		},

		loginRequired: function(transition) {
			console.log('Login required');

			this.controllerFor('login').setProperties({
				'attempt': transition,
				'content': {
					errors: [{
						message: "You don't have enough permissions to access this view."
					}]
				}
			});

			this.transitionTo('login');
		},

		actions: {
			error: function(reason, transition) {
				if(reason.status === 403 || reason.status === 401) {
					this.loginRequired(transition);
				}
			}
		}
	});

	//TODO auto-require files -->	routesLoader.initializeFiles(JSON.parse(manifest), function());
	routesLoader.initializeRoutes(Application, manifest);

	Application.ApplicationAdapter = DS.RESTAdapter.extend({
		findAll: function(store, type) {
			return type.findAll(store, localStorage.cps_authkey);
		},
		pathForType: function(type) {
			console.log("pathForType", type);
			return "rest/object/" + Ember.String.underscore(type);
		}
	});

	Application.ApplicationSerializer = DS.RESTSerializer.extend({
		extractFindAll: function(store, type, payload) {
			return type.extractFindAll(store, payload);
		}
	})

	return Application;
});
