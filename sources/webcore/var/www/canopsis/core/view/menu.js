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
	'app/application'
], function($, Ember, Application) {

	Application.MenuView = Ember.View.extend({
		actions: {
			showmenu: function() {
				console.log("showing mmenu (app)");
			},
			menuAction: function() {
				console.old.log("Action");
				console.old.log(arguments);

				//convert args to array
				var args = Array.prototype.slice.call(arguments);
				var actionName = args.shift();

				// this.get('controller.controllers.another').send('someAction');
				this.send(actionName, args);
			}
		},
		templateName: 'menu',
		items: function() {
			console.log("menu selector result");

			var selectorResult = JSONSelect.match(this.get('selector'), Application.manifest);

			if(selectorResult === undefined)
				selectorResult = [];
			if(!selectorResult.toArray === undefined)
				selectorResult = [selectorResult];

			console.log(selectorResult);
			return selectorResult;
		}.property('items'),

		isAction: function (scenarioStep) {
			return scenarioStep.type === "action";
		}
	});

	return Application.MenuView;
});