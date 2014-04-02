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
	'app/model/selector'
], function($, Ember, Application, Selector) {
	Application.SelectorsRoute = Application.CrecordsRoute.extend({
		setupController: function(controller, model) {
			controller.set('content', {
				toolitems: controller.toolbar,
				selectors: model
			});
		},

		model: function() {
			return this.store.findAll('selector');
		}
	});

	Application.SelectorsController = Ember.ObjectController.extend({
		toolbar: [{
			title: 'Refresh',
			action: 'refresh',
			icon: 'refresh'
		},{
			title: 'Add',
			action: 'showAddForm',
			icon: 'plus-sign'
		},{
			title: 'Duplicate',
			action: 'duplicate',
			icon: 'file'
		},{
			title: 'Remove',
			action: 'remove',
			icon: 'trash'
		},{
			title: 'Import',
			action: 'import',
			icon: 'import'
		},{
			title: 'Export',
			action: 'export',
			icon: 'open'
		}],

		actions: {
			do: function(action) {
				this.send(action);
			},

			derogate: function(id) {
				;
			},

			refresh: function() {
				controller.set('content', {
					'toolitems': this.toolbar,
					'selectors': this.store.findAll('selector')
				});
			},

			add: function() {
				;
			},

			duplicate: function() {
				;
			},

			remove: function() {
				;
			},

			import: function() {
				;
			},

			export: function() {
				;
			}
		}
	});

	return Application.SelectorsController;
});