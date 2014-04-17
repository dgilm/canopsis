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

	Application.Selector.reopenClass({
		findAll: function(store, authkey) {
			return $.ajax({
				url: '/rest/object/selector',
				method: 'GET',
				contentType: 'application/json',
				data: {
					authkey: authkey
				}
			});
		},

		extractFindAll: function(store, payload) {
			var selectors = [];

			for(var i = 0; i < payload.data.length; i++) {
				var selector = payload.data[i];

				var pf_0 = selector.sla_timewindow_perfdata.findBy('metric', 'cps_pct_by_state_0');
				var pf_1 = selector.sla_timewindow_perfdata.findBy('metric', 'cps_pct_by_state_1');
				var pf_2 = selector.sla_timewindow_perfdata.findBy('metric', 'cps_pct_by_state_2');
				var pf_3 = selector.sla_timewindow_perfdata.findBy('metric', 'cps_pct_by_state_3');

				selector.sla_pf_0 = pf_0.value + pf_0.unit;
				selector.sla_pf_1 = pf_1.value + pf_1.unit;
				selector.sla_pf_2 = pf_2.value + pf_2.unit;
				selector.sla_pf_3 = pf_3.value + pf_3.unit;

				selector.name = selector.crecord_name;

				selector.owner = selector.aaa_owner.substring('account.'.length);
				delete selector.aaa_owner;

				selector.group = selector.aaa_group.substring('group.'.length);
				delete selector.aaa_group;

				selectors.push(selector);
			}

			return selectors;
		}
	});

	return Application.Selector;
});