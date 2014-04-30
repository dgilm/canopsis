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
	'app/lib/schema-manager',
	'app/model/container'
], function($, Ember, DS, Application) {
	Application.UserviewAdapter = DS.FixtureAdapter.extend();

	Application.Userview = Application.Crecord.extend({
		_id: DS.attr('string'),
		crecord_name: DS.attr('string'),
		container: DS.belongsTo('container',{embedded: 'always'}),
		internal: DS.attr('boolean'),
		enable: DS.attr('boolean')
	});  

	Application.Userview.FIXTURES = [{ "_id" : "view_vertical", 
                                       "enable" : true, 
                                       "crecord_name" : "Vue Verticale",
                                       "internal":true,
                                       "container" : { "_id" : "test_view_vertical_container", 
                                                       "title" : "", 
                                                       "widget_type" : "container", 
                                                       "userview" : "view_vertical", 
                                                       "layout_rows" : 5, 
                                                       "layout_cols" : 5,
                                                       "items" : [ { "_id" : "test_view_vertical_container_item_1", 
                                                                     "container" : "test_view_vertical_container", 
                                                                     "widget" : "", "row" : 1, "col" : 1, 
                                                                     "rowspan" : 1, "colspan" : 1, 
                                                                     "isSelected" : false, "isActivated" : true }, 

                                                                   { "_id" : "test_view_vertical_container_item_2", 
                                                                     "container" : "test_view_vertical_container", 
                                                                     "widget" : "", "row" : 2, "col" : 1, "rowspan" : 2, 
                                                                     "colspan" : 2, "isSelected" : false, 
                                                                     "isActivated" : true }, 

                                                                    { "_id" : "test_view_vertical_container_item_3", 
                                                                      "container" : "test_view_vertical_container", 
                                                                      "widget" : "", "row" : 3, "col" : 2, "rowspan" : 1, 
                                                                      "colspan" : 2, "isSelected" : false, 
                                                                      "isActivated" : true }, 

                                                                    { "_id" : "test_view_vertical_container_item_4", 
                                                                      "container" : "test_view_vertical_container", 
                                                                      "widget" : "", "row" : 4, "col" : 4, "rowspan" : 1, 
                                                                      "colspan" : 1, "isSelected" : false, "isActivated" : true }, 

                                                                    { "_id" : "test_view_vertical_container_item_5",
                                                                      "container" : "test_view_vertical_container", 
                                                                      "widget" : "", "row" : 3, "col" : 4, 
                                                                      "rowspan" : 1, "colspan" : 1, "isSelected" : false,
                                                                      "isActivated" : true } ]
                                                   	} 
                                           }];
	/*							   
	Application.UserviewSerializer = DS.ActiveModelSerializer.extend( {
		attrs: { 
			container: {embedded: 'always'} 
		}
	});
	*/
	Application.Userview.reopenClass({

		find: function(store, authkey) {
			console.log("Userview find");
			return $.ajax({
				url: '/rest/object/view',
				method: 'GET',
				contentType: 'application/json',
				data: {
					authkey: authkey
				}
			});
		},

		findAll: function(store, authkey) {
			console.log("Userview findAll");
			return $.ajax({
				url: '/rest/object/view',
				method: 'GET',
				contentType: 'application/json',
				data: {
					authkey: authkey
				}
			});
		},

		extractFindAll: function(store, payload) {
			var userviews = [];
			console.log("Userview extractFindAll", payload);

			for(var i = 0; i < payload.data.length; i++) {
				var userview = payload.data[i];
				userviews.push(userview);
			}
			return userviews;
		},

		extractFind: function(store, payload) {
			var userviews = [];
			console.log("Userview extractFind", payload);

			return userviews;
		},

		extractSingle: function(store, type, payload, id, requestType) {
			var userview = payload.data;
			console.log("Userview extractSingle", payload);
			return userview;
		}
	});

	return Application.Userview;
});
