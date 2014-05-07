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
	  Implements pagination in ArrayControllers

	  You should define on the ArrayController:
		  - the `findOptions` property
		  - the `findItems()` method

	*/
	Ember.PaginationMixin = Ember.Mixin.create({
		actions: {
			prevPage: function() {
				if(this.get("currentPage") > 1) {
					this.set("currentPage", this.get("currentPage") - 1);
				}
			},
			nextPage:function() {
				if(this.get("currentPage") < this.get("totalPages")) {
					this.set("currentPage", this.get("currentPage") + 1);
				}
			}
		},

		itemsTotal: 1,
		itemsPerPage: 20,
		currentPage: 1,
		totalPages: 1,

		onCurrentPageChanges: function(){
			this.refreshContent();
		}.observes('currentPage'),

		refreshContent: function() {
			var start = this.itemsPerPage * (this.currentPage - 1);
			var me = this;

			this.findOptions.start = start;
			this.findOptions.itemsPerPage = this.itemsPerPage;
		},

		extractItems: function(queryResult) {
			//this may be more appropriate in CrecordsSerializer...
			console.log("extractItems", arguments);
			var metadata = queryResult.meta;

			this.set('itemsTotal', metadata.total);

			if(metadata.total === 0) {
				this.set('totalPages', 0);
			} else {
				this.set('totalPages', Math.ceil(metadata.total / this.itemsPerPage));
			}

			this._super(queryResult);
		}
	});

	return Ember.PaginationMixin;
});
