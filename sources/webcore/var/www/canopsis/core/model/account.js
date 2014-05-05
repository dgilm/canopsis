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
	'app/model/crecord',
	'app/lib/schema-manager',
	'app/serializers/account'
], function($, Ember, DS, Application) {
	// var accountModelDict = {
	// 	enable: DS.attr('boolean'),
	// 	user: DS.attr('string', {description: "the user name"}),
	// 	firstname: DS.attr('string'),
	// 	lastname: DS.attr('string'),
	// 	mail: DS.attr('string', {role: "mail"}),
	// 	group: DS.attr('string', {role: "group"}),
	// 	groups: DS.attr('array')
	// };
	// console.log("accounts crecord model ", Application.Crecord)
	// Application.Account = Application.Crecord.extend(accountModelDict);

	// console.log("account model", accountModelDict);

	Application.Account.reopenClass({
		findAll: function(store, authkey) {
			return $.ajax({
				url: '/account/',
				method: 'GET',
				contentType: 'application/json',
				data: {
					authkey: authkey
				}
			});
		}
	});

	return Application.Account;
});