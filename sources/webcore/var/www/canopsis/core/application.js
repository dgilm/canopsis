define([
	'jquery',
	'app/lib/ember',
	'app/lib/ember-data'
], function($, Ember, DS) {
	var Application = Ember.Application.create({});

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
			//should be in a class that inherits from authenticatedroute
			show_add_crecord_form: function(crecord_type){
				var referenceModel = Application[crecord_type.capitalize()];

				//TODO put this in crecordformController
				var modelAttributes = Ember.get(referenceModel, 'attributes')

				var attributes = [];
				modelAttributes.forEach(function(field, attrModel) {
					attributes.push({field: field, model: attrModel});
				});

				crecordformController = Application.CrecordformController.create();
				crecordformController.set('content', attributes);
				crecordformController.set('crecord_type', crecord_type);

				this.render("addcrecordform", {
					into: 'application',
					outlet: 'sidebar',
					controller: crecordformController
				});

				$("#mmenu").trigger("open");
			},
			error: function(reason, transition) {
				if(reason.status === 403 || reason.status === 401) {
					this.loginRequired(transition);
				}
			}
		}
	});

	Application.Router.map(function() {
		this.resource('login');

		this.resource('build', function() {
			this.resource('accounts');
			this.resource('groups');
			this.resource('curves');
			this.resource('perfdatas');
			this.resource('selectors');
			this.resource('consolidations');
			this.resource('topologies');
			this.resource('eventfilter');
		});

		this.resource('run', function() {
			this.resource('userviews');
		});
		// this.resource('userview', { path: '/userview/:userview_id' });

	});

	Application.ApplicationAdapter = DS.RESTAdapter.extend({
		findAll: function(store, type) {
			return type.findAll(store, localStorage.cps_authkey);
		}
	});

	Application.ApplicationSerializer = DS.RESTSerializer.extend({
		extractFindAll: function(store, type, payload) {
			return type.extractFindAll(store, payload);
		}
	})

	return Application;
});