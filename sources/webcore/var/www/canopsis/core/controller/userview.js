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
	'app/application',
	'app/model/userview'
], function($, Ember, Application, Userview) {

	Application.UserviewIndexRoute = Application.AuthenticatedRoute.extend({
		setupController: function(controller, model) {
			console.log("UserviewIndexRoute setupController");
			controller.set('content', model);
			controller.set('toolitems', controller.toolbar);
		},

		model: function() {
			console.log("model");
			return this.store.findAll('userview');
		},
    	
    	renderTemplate: function() {
       		var itemController = this.controllerFor('container/:'+this.get("container_id"));
        	this.render('container', {
          	outlet: 'container',
          	controller: containerController 
          		});
      		}
	});

	Application.UserviewController = Ember.ObjectController.extend({
		needs:['container'],
		actions:{
			showView: function() {
				console.log("test");
				console.log(this.get("crecord_name:"));
				this.transitionToRoute("/userview/" + this.get("_id"));
				var container = this.store.find('widget',{'_id':this.get("container_id")});

			}
		}
	});

	Application.UserviewIndexController = Ember.ObjectController.extend({
	});

	return Application.UserviewController;
});
