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
	'app/serializers/application'
], function($, Ember, DS, Application, ApplicationSerializer) {

	Application.PerfdataSerializer = ApplicationSerializer.extend({
		extractFindAll: function(store, type, payload) {
			var perfdatas = [];

			for(var i = 0; i < payload.data.length; i++) {
				var perfdata = payload.data[i];

				perfdata.component = perfdata.co;
				perfdata.resource = perfdata.re;
				perfdata.metric = perfdata.me;
				perfdata.unit = perfdata.u;
				perfdata.type = perfdata.t;
				perfdata.retention = perfdata.r;
				perfdata.first_point = perfdata.fts;
				perfdata.last_point = perfdata.lts;
				perfdata.last_value = perfdata.lv;
				perfdata.min = perfdata.mi;
				perfdata.max = perfdata.ma;
				perfdata.tags = perfdata.tg;

				delete perfdata.co;
				delete perfdata.re;
				delete perfdata.me;
				delete perfdata.u;
				delete perfdata.t;
				delete perfdata.r;
				delete perfdata.fts;
				delete perfdata.lts;
				delete perfdata.lv;
				delete perfdata.mi;
				delete perfdata.ma;
				delete perfdata.tg;

				perfdatas.push(perfdata);
			}

			return perfdatas;
		}
	});

	return Application.PerfdataSerializer;
});
