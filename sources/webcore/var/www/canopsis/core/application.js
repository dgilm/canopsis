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

	//Definition of two new data-types :
	
	Application.initializer({
		name:"RESTAdaptertransforms",
		after: "transforms",
		initialize:function(container,application){
			application.register('transform:array',DS.ArrayTransform);
			application.register('transform:object',DS.ObjectTransform);
		}
	});

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
			if(type.findAll === undefined) {
				console.old.error("findAll is not set in", type);
			}
			return type.findAll(store, localStorage.cps_authkey);
		},

		find: function(store, type) {
			if(type.find === undefined) {
				console.old.error("find is not set in", type);
			}
			return type.find(store, localStorage.cps_authkey);
		},

		pathForType: function(type) {
			console.log("pathForType", type);
			if(type === "userview") {
				type = "view";
			}
			return "rest/object/" + Ember.String.underscore(type);
		},

		findBelongsTo: function(store, record, url){
		}
	});

	Application.ApplicationSerializer = DS.RESTSerializer.extend({    

		extractFindAll: function(store, type, payload) {
			if(type.extractFindAll === undefined) {
				console.old.error("extractFindAll is not set in", type);
			}

			return type.extractFindAll(store, payload);
		},

		extractFind: function(store, type, payload) {
			if(type.extractFind === undefined) {
				console.old.error("extractFind is not set in", type);
			}

			return type.extractFind(store, payload);
		}
	});

	return Application;
});
