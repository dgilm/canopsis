define([
	'jquery',
	'app/lib/ember',
	'app/lib/ember-data',
	'app/application'
], function($, Ember, DS, Application) {
	Application.Item = DS.Model.extend({
        _id : DS.attr("string",{ hiddenInForm: true }),
        container: DS.attr('string'),
        widget : DS.attr(),
        row : DS.attr("number",{ defaultValue:0 }),
        col : DS.attr("number",{ defaultValue:0 }),
        rowspan : DS.attr("number",{ defaultValue:1 }),
        colspan : DS.attr("number",{ defaultValue:1 }),
        isSelected : DS.attr("boolean", {defaultValue:false }),
        isActivated : DS.attr("boolean", {defaultValue:true })
    });
    Application.Item.FIXTURES = [{ "_id" : "test_view_vertical_container_item_1",  
                                   "container" : "test_view_vertical_container", 
                                   "widget" : "", 
                                   "row" : 1, 
                                   "col" : 1, 
                                   "rowspan" : 1, 
                                   "colspan" : 1, 
                                   "isSelected" : false, 
                                   "isActivated" : true },

                                   { "_id" : "test_view_vertical_container_item_2", 
                                     "container" : "test_view_vertical_container", 
                                     "widget" : "", 
                                     "row" : 2, 
                                     "col" : 1, 
                                     "rowspan" : 2, 
                                     "colspan" : 2, 
                                     "isSelected" : false, 
                                     "isActivated" : true
                                   },{
                                    "_id" : "test_view_vertical_container_item_3", 
                                    "container" : "test_view_vertical_container", 
                                    "widget" : "", "row" : 3, 
                                    "col" : 2, "rowspan" : 1, 
                                    "colspan" : 2, "isSelected" : false,
                                     "isActivated" : true
                                   },{
                                    "_id" : "test_view_vertical_container_item_4",
                                    "container" : "test_view_vertical_container", 
                                    "widget" : "", "row" : 4, "col" : 4, "rowspan" : 1, 
                                    "colspan" : 1, "isSelected" : false, "isActivated" : true
                                   },{
                                    "_id" : "test_view_vertical_container_item_5", 
                                    "container" : "test_view_vertical_container", 
                                    "widget" : "", "row" : 3, "col" : 4, "rowspan" : 1, 
                                    "colspan" : 1, "isSelected" : false, "isActivated" : true
                                   }];
  return Application.Item ;
 });
