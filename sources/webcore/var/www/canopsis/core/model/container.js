define([
	'jquery',
	'app/lib/ember',
	'app/lib/ember-data',
	'app/application',
    'app/serializers/container',
    'app/model/widget',
    'app/model/item',
    'app/model/userview'
], function($, Ember, DS, Application){

	Application.Container = Application.Widget.extend({
		userview: DS.belongsTo('userview'),
		items: DS.hasMany('item',{embedded: 'always'}),
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

	return Application.Container;
});
