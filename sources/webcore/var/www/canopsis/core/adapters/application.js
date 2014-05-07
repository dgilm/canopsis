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
	'app/application'
], function($, Ember, DS, Application) {

	Application.ApplicationAdapter = DS.RESTAdapter.extend({
		getApiUrl: function(type) {
			return "/rest/object/" + type.typeKey
		},

		findAll: function(store, type) {
			console.log("findAll", arguments);
			return this.findQuery(store, type, { authkey : localStorage.cps_authkey });
		},

		findQuery: function(store, type, options) {
			console.log("findQuery", arguments);

			try{
				if(options === undefined) {
					options = {};
				}
				options["authkey"] = localStorage.cps_authkey;
				console.log("new options", options);

				return $.ajax({
					url: this.getApiUrl(type),
					method: 'GET',
					contentType: 'application/json',
					data: options
				});
			} catch (e) {
				console.error(e.message, e.stack);
			}
		},

		find: function(store, type) {
			console.log("findQuery", arguments);

			if(type.find === undefined) {
				console.error("find is not set in", type);
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
		},

		createRecord: function(store, type, record) {
			console.log("createRecord", arguments);
			var serializer = store.serializerFor(type.typeKey);

			var data = {};
			data = serializer.serializeIntoHash(data, type, record, { includeId: true });
			console.log("createRecord data", data);
			return this.ajax(this.buildURL(type.typeKey), "POST", { data: data });
		},

		updateRecord: function(store, type, record) {
			console.log("updateRecord", arguments);

			var data = {};
			var serializer = store.serializerFor(type.typeKey);

			data = serializer.serializeIntoHash(data, type, record);

			var id = Ember.get(record, 'id');

			console.log("updateRecord data", data);
			return this.ajax(this.buildURL(type.typeKey, id), "PUT", { data: data });
		}

	});

	return Application.ApplicationAdapter;
});
