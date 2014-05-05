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

	Ember.PaginationMixin = Ember.Mixin.create({

		pages: function() {
			var availablePages = this.get('availablePages'),
			pages = [],
			page;

			for (i = 0; i < availablePages; i++) {
				page = i + 1;
				pages.push({ page_id: page.toString() });
			}

			return pages;
		}.property('availablePages'),

		currentPage: function() {
			return parseInt(this.get('selectedPage'), 10) || 1;
		}.property('selectedPage'),

		nextPage: function() {
			var nextPage = this.get('currentPage') + 1;
			var availablePages = this.get('availablePages');

			if (nextPage <= availablePages) {
					return Ember.Object.create({id: nextPage});
			}else{
					return Ember.Object.create({id: this.get('currentPage')});
			}
		}.property('currentPage', 'availablePages'),

		prevPage: function() {
			var prevPage = this.get('currentPage') - 1;

			if (prevPage > 0) {
					return Ember.Object.create({id: prevPage});
			}else{
					return Ember.Object.create({id: this.get('currentPage')});
			}
		}.property('currentPage'),

		availablePages: function() {
			return Math.ceil((this.get('content.length') / this.get('itemsPerPage')) || 1);
		}.property('content.length'),

		paginatedContent: function() {
			var selectedPage = this.get('selectedPage') || 1;
			var upperBound = (selectedPage * this.get('itemsPerPage'));
			var lowerBound = (selectedPage * this.get('itemsPerPage')) - this.get('itemsPerPage');
			var models = this.get('content');

			return models.slice(lowerBound, upperBound);
		}.property('selectedPage', 'content.@each')

	});
	return Application.AccountSerializer;
});
