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

define(function(require, exports, module) {
	require('ember');
	require('ember-data');

	DS.ArrayTransform = DS.Transform.extend({
		deserialize: function(serialized) {
			if(Ember.typeOf(serialized) === 'array') {
				return serialized;
			}

			return [];
		},

		serialize: function(deserialized) {
			var type = Ember.typeOf(deserialized);

			if(type === 'array') {
				return deserialized;
			}
			else if(type === 'string') {
				return deserialized.split(',').map(function(item) {
					return jQuery.trim(item);
				});
			}

			return [];
		}
	});

	return DS;
});