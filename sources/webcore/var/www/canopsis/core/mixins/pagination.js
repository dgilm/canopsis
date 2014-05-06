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

	/**
	  Implements pagination in ArrayControllers

	  You should set :
		  - the `itemType` property
		  - the `findOptions` property
		  - the `findItems()` method

	*/
	Ember.PaginationMixin = Ember.Mixin.create({
		itemsTotal: 1,
		itemsPerPage: 10,
		currentPage: 1,
		totalPages: 1,

		refreshContent: function() {
			var start = this.itemsPerPage * (this.currentPage - 1);
			var me = this;

			if(this.findOptions === undefined) {
				this.findOptions = {};
			}

			this.findOptions.start = start;
			this.findOptions.itemsPerPage = this.itemsPerPage;

			this.findItems(function(queryResult) {
				console.log("refreshContent promise", queryResult);

				var metadata = queryResult.meta;
				console.log("meta", metadata);
				me.set('itemsTotal', metadata.total);
				if(metadata.total === 0) {
					me.set('totalPages', 0);
				} else {
					me.set('totalPages', Math.ceil(metadata.total / me.itemsPerPage));
				}
			});
		}.observes('currentPage')
	});

	return Ember.PaginationMixin;
});
