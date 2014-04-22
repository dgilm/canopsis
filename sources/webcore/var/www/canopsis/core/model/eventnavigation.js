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
	'app/model/crecord'
], function($, Ember, DS, Application, Crecord) {
	Application.Eventnavigation = Application.Crecord.extend({
		timestamp	: DS.attr('number', {'role': 'timestamp'}),
		component	: DS.attr('string'),
		resource	: DS.attr('string'),
		connector	: DS.attr('string'),
		output		: DS.attr('string'),
		state		: DS.attr('number', {'role': 'state'})
	});

	Application.Eventnavigation.reopenClass({
		findAll: function(store, authkey) {
			return $.ajax({
				url: '/rest/events/event',
				method: 'GET',
				contentType: 'application/json',
				data: {
					authkey: authkey
				}
			});
		},

		extractFindAll: function(store, payload) {
			var events = [];

			for(var i = 0; i < payload.data.length; i++) {
				var evt = payload.data[i],
					key;

				events.push(evt);
			}

			return events;
		}
	});

	return Application.Eventnavigation;
});