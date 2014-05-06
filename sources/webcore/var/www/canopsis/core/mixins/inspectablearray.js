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
	var get = Ember.get, set = Ember.set;

	Ember.InspectableArrayMixin = Ember.Mixin.create({
		attributesKeys: function() {
			var attributes = [];

			var attributesDict = this.get('content.type.attributes.values');

			console.log(this);
			console.log("attributesKeys", attributesDict, this.get('content'));

			for(key in attributesDict) {
				var attr = attributesDict[key];
				// console.log('isAttrHidden? ', attr.name, attr.options.hiddenInLists, attr.options.hiddenInLists !== false);
				if(attr.options.hiddenInLists === false || attr.options.hiddenInLists === undefined) {
					attributes.push({
						field: attr.name,
						type: attr.type,
						options: attr.options
					});
					console.log("pushed attr", {
						field: attr.name,
						type: attr.type,
						options: attr.options
					});
				}
			};
			return attributes;
		}.property('content')
	});

	return Ember.InspectableArrayMixin;
});
