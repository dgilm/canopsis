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
], function($, Ember, DS, Application) {
	Application.Userview = Application.Crecord.extend({
		enable: DS.attr('boolean'),

		_id: DS.attr('string'),
		name: DS.attr('string')
	});

	Application.Userview.reopenClass({
		findAll: function(store, authkey) {
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

			for(var i = 0; i < payload.data.length; i++) {
				var userview = payload.data[i];

				userview.name = userview._id;
				userviews.push(userview);
			}

			return userviews;
		}
	});

	return Application.Userview;
});