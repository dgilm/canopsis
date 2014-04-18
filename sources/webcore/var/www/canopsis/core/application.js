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
	'jsonselect'
], function($, Ember, DS) {

	var Application = Ember.Application.create({});

	// Ember.applicationInstance = Application;

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

	Application.ApplicationAdapter = DS.RESTAdapter.extend({

		findAll: function(store, type) {
			console.log("findAll", type);
			return type.findAll(store, localStorage.cps_authkey);
		},

		find: function(store, type) {
			console.log("find", type);
			return type.find(store, localStorage.cps_authkey);
		},

		pathForType: function(type) {
			console.log("pathForType", type);
			if(type === "userview") {
				type = "view";
			}
			
			return "rest/object/" + Ember.String.underscore(type);
		}
	});

	Application.ApplicationSerializer = DS.RESTSerializer.extend({
		extractFindAll: function(store, type, payload) {
			var result = type.extractFindAll(store, payload)
			return result;
		},
		extractFind: function(store, type, payload) {
			var result = type.extractFind(store, payload)
			return result;
		}
	});

	return Application;
});
