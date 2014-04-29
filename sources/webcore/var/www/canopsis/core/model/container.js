define([
	'jquery',
	'app/lib/ember',
	'app/lib/ember-data',
	'app/application',
    'app/model/widget',
    'app/model/item',
    'app/model/userview'
], function($, Ember, DS, Application){

	Application.ContainerRoute = Application.AuthenticatedRoute.extend({
    	setupController: function(controller, model) {
      		console.log("ContainerRoute setupController");
      		controller.set('content', model);
      		controller.set('toolitems', controller.toolbar);
    	},

    	model: function() {
      		console.log("model");
      		return this.store.find('container');
    	}
  });

	Application.Container = Application.Widget.extend({
		view: DS.belongsTo('userview'),
		items: DS.hasMany('item'),
        layout_cols : DS.attr('number'),
        layout_rows : DS.attr('number'),
        /*
        grid:function(){
      		var items = this.get("items");
     	 	console.log("create grid");

     		var layout = "<ul>";

      		for( var item in this.get("items") ){
        		var item = this.store.find('item',{'_id':item_ID});
        		layout = layout + '<li data-row="'+ item.row.toString()+'"';
       		 	layout = layout +' data_col="'+ item.col.toString()+'"';
        		layout = layout +' data-sizex="'+ item.rowspan.toString()+'"';
        		layout = layout +' data-sizey="'+ item.colspan.toString()+'">'+item._id+'</li>';
      		}
      
      		layout = layout + '</ul>';
      		console.log(layout);
    
      		return layout;

   		}.property("items")
		*/
	});


	Application.Container.reopenClass({

	});

	return Application.Container;
});
