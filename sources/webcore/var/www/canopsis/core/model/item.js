define([
	'jquery',
	'app/lib/ember',
	'app/lib/ember-data',
	'app/application',
  'app/serializers/item',
  'app/model/container'
], function($, Ember, DS, Application){

  Application.ItemRoute = Application.AuthenticatedRoute.extend({
    model:function(){
      console.log("item model");
      return this.store.find();
    }
  });
    
	Application.Item = DS.Model.extend({
        _id : DS.attr("string"),
        container: DS.belongsTo('container'),
        widget : DS.belongsTo('widget',{embedded: 'always'}),
        row : DS.attr("number"),
        col : DS.attr("number"),
        rowspan : DS.attr("number"),
        colspan : DS.attr("number"),
        isSelected : DS.attr("boolean"),
        isActivated : DS.attr("boolean")
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
