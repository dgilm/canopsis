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
	Application.Curve = Application.Crecord.extend({
		line_color: DS.attr('string'),
		area_color: DS.attr('string'),
		line_style: DS.attr('string'),
		area_opacity: DS.attr('number'),
		zindex: DS.attr('number'),
		invert: DS.attr('boolean'),
		metric: DS.attr('string'),
		label: DS.attr('string')
	});

	Application.Curve.reopenClass({
		findAll: function(store, authkey) {
			return $.ajax({
				url: '/rest/object/curve',
				method: 'GET',
				contentType: 'application/json',
				data: {
					authkey: authkey
				}
			});
		},

		extractFindAll: function(store, payload) {
			var curves = [];

			for(var i = 0; i < payload.data.length; i++) {
				var curve = payload.data[i];

				curve.line_color = '#' + curve.line_color;
				curve.area_color = '#' + curve.area_color;
				curve.line_style = curve.dashStyle;
				curve.zindex = curve.zIndex;

				delete curve.dashStyle;
				delete curve.zIndex;

				curves.push(curve);
			}

			return curves;
		}
	});

	return Application.Curve;
});