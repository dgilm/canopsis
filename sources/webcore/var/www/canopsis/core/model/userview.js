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
	'app/application',
	'app/lib/schema-manager'
], function($, Ember, DS, Application) {

	Application.Userview = Application.Crecord.extend({
		_id: DS.attr('string'),
		crecord_name: DS.attr('string'),
		container_id: DS.attr('string'),
		internal: DS.attr('boolean'),
		enable: DS.attr('boolean')
	});

	Application.Userview.reopenClass({

		find: function(store, authkey) {
			console.log("Userview find");
			return $.ajax({
				url: '/rest/object/view',
				method: 'GET',
				contentType: 'application/json',
				data: {
					authkey: authkey
				}
			});
		},

		findAll: function(store, authkey) {
			console.log("Userview findAll");
			return $.ajax({
				url: '/rest/object/view',
				method: 'GET',
				contentType: 'application/json',
				data: {
					authkey: authkey
				}
			});
		},

		extractFindAll: function(store, payload) {
			var userviews = [];
			console.log("Userview extractFindAll", payload);

			for(var i = 0; i < payload.data.length; i++) {
				var userview = payload.data[i];
				userviews.push(userview);
			}
			return userviews;
		},

		extractFind: function(store, payload) {
			var userviews = [];
			console.log("Userview extractFind", payload);

			return userviews;
		},

		extractSingle: function(store, type, payload, id, requestType) {
			var userview = payload.data;
			console.log("Userview extractSingle", payload);
			return userview;
		}
	});


	return Application.Userview;
});
