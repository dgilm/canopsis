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
	'app/model/eventnavigation'
], function($, Ember, Application, Eventnavigation) {
	Application.EventnavigationRoute = Application.CrecordsRoute.extend({
		setupController: function(controller, model) {
			controller.set('content', model);
			controller.set('toolitems', controller.toolbar);
		},

		model: function() {
			return this.store.findAll('eventnavigation');
		}
	});

	Application.EventnavigationController = Application.CrecordsController.extend({
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
		}],

		actions: {
			refresh: function() {
				this.set('model', this.store.findAll('eventnavigation'));
			},

			updateAcknowlegement: function(crecord) {
				console.log({crecord: crecord, _id: crecord.get('_id')});

/*
				console.log({controllerinstance : this.controllerFor("login").get("currentRouteName")});
				console.log({controllerinstance : this.get('controllers.login.username')});
				console.log({controller : Application.__container__.lookup('controller:login')});
*/
				$.post(
					'/event/',
					{
						"ref_rk"	: "cengine.engine.check.resource.Sphinx.Engine_topology",
						"connector"		: "canopsis_ui",
						"connector_name": "canopsis_ui",
						"event_type"	: "ack",
						"source_type"	: "ack",
						"component"		: 'event_ack',
						"state"			: 0,
						"state_type"	: 1,
						"output"		: "comment",
						"author"		: "author",

					}, function (data) {
						console.log(data);
						crecord.set('ack', true);
					}
				);

			},

			cancelAlert: function(store, authkey) {

				$.post(
					'/event/',
					{
						"referer_rk"	: "",
						"connector"		: "canopsis_ui",
						"connector_name": "canopsis_ui",
						"event_type"	: "ack",
						"source_type"	: "ack",
						"component"		: 'event_ack',
						"state"			: 0,
						"state_type"	: 1,
						"output"		: "plop",
						"author"		: "plop",

					}, function (data) {
						console.log(data);
					}
				);
			}

		}
	});

	return Application.EventnavigationController;
});