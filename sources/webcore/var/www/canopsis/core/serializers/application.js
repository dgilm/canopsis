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

	Application.ApplicationSerializer = DS.RESTSerializer.extend({

		extractFindAll: function(store, type, payload) {
			if(type.extractFindAll === undefined) {
				console.error("extractFindAll is not set in", type);
			}

			return type.extractFindAll(store, payload);
		},

		extractFind: function(store, type, payload) {
			if(type.extractFind === undefined) {
				console.error("extractFind is not set in", type);
			}

			return type.extractFind(store, payload);
		},

		serialize: function(record, options) {
			console.log("ApplicationSerializer::serialize", arguments);
			var result = this._super.apply(this, arguments);
			console.log("ApplicationSerializer::serialize done", result);

			return result;
		},

		normalize: function(record, options) {
			console.log("ApplicationSerializer::normalize", arguments);
			var result = this._super.apply(this, arguments);
			console.log("ApplicationSerializer::normalize done", result);

			return result;
		},

		serializeIntoHash: function(hash, type, record, options) {
			hash = this.serialize(record, options);
			console.log("serializeIntoHash done", hash);
			return hash;
		}
	});

	return Application.ApplicationSerializer;
});
