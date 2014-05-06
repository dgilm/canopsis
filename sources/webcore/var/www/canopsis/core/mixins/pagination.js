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

	//Mixin for pagination. Classes must have the "itemType" property
	Ember.PaginationMixin = Ember.Mixin.create({
		itemsTotal: 1,

		itemsPerPage: 10,

		currentPage: 1,

		totalPages: function() {
			console.log("totalPages", this.itemsTotal, this.itemsPerPage);

			return Math.ceil(this.itemsTotal / this.itemsPerPage);
		}.property("itemsTotal", "model.isLoaded"),

		refreshContent: function() {
			var start = this.itemsPerPage * (this.currentPage - 1)
			console.log(this.itemsPerPage);
			var me = this;

			var result = this.store.findQuery(this.itemType, { start: start, itemsPerPage: this.itemsPerPage }).then(function(queryResult){
				console.log("refreshContent promise", queryResult);

				var metadata = queryResult.meta;
				console.log("meta", metadata);
				me.set('itemsTotal', metadata.total);
				if(metadata.total === 0) {
					me.set('totalPages', 0);
				} else {
					me.set('totalPages', Math.ceil(metadata.total / me.itemsPerPage));
				}

				me.set("content", queryResult);
			});
		}.observes('currentPage')
	});
	return Application.AccountSerializer;
});
