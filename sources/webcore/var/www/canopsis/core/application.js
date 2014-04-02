/*
# Copyright (c) 2014 "Capensis" [http://www.capensis.com]
#
# This file is part of Canopsis.
#
# Canopsis is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Canopsis is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
*/

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
