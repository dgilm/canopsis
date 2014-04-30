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
	'app/application',
	'app/model/notifications'
], function($, Ember, Application) {
	console.log(Application)
	console.log("Application")
	Application.NotificationsRoute = Ember.Route.extend({
		model: function() {
			return this.store.find('notification');
		}
	});

	Application.NotificationsController = Ember.ArrayController.extend({

		actions: {
			createNotification: function (message, level) {

				if (message === undefined) {
					message = 'default message';
				}
				if (level === undefined) {
					level = 'warning';
				}
				var notification = this.store.createRecord('notification',{
					level: level,
					message: message,
					timestamp: new Date().getTime(),
					alertLevel: 'alert-' + level
				});

				notification.save();
			}
		},
	});


	return Application.NotificationsController;
});