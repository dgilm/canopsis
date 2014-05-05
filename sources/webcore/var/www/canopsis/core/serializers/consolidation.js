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

	Application.ConsolidationSerializer = ApplicationSerializer.extend({
		extractFindAll: function(store, type, payload) {
			var consolidations = [];

			for(var i = 0; i < payload.data.length; i++) {
				var conso = payload.data[i];

				conso.name = conso.crecord_name;
				conso.message = conso.output_engine;

				consolidations.push(conso);
			}

			return consolidations;
		}
	});

	return Application.ConsolidationSerializer;
});
