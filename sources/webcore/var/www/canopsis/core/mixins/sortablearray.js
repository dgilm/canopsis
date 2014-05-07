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
	'app/application'
], function($, Ember, DS, Application, ApplicationSerializer) {
	var get = Ember.get, set = Ember.set;

	/**
	  Implements sorting in arraycontrollers

	  You should define on the ArrayController:
		  - the `findOptions` property
		  - the `refreshContent()` method

	*/
	Ember.SortableArrayMixin = Ember.Mixin.create({
		actions: {
			sortBy:function(attributeField, direction) {
				console.log("sortBy", arguments);
				if(this.findOptions === undefined)
					this.findOptions = {};

				this.findOptions.sort = JSON.stringify([{"property":attributeField,"direction": direction}]);

				this.refreshContent();
			}
		}
	});

	return Ember.SortableArrayMixin;
});
