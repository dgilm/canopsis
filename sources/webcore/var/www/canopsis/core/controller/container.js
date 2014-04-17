define([
'jquery',
'app/lib/ember',
'app/application',
'app/model/container'
], function($, Ember, Application, Container ){

  Application.ContainerRoute = Application.AuthenticatedRoute.extend({
    setupController: function(controller, model) {
      console.log("ContainerRoute setupController");
      controller.set('content', model);
      controller.set('toolitems', controller.toolbar);
    },

    model: function() {
      console.log("model");
      return this.store.findAll('container');
    }
  });

    Application.ContainerController = Application.WidgetController.extend({

    needs:["item"],

    createLayout:function(){
        console.log("createLayout");

        var layout = "<ul>";

        for( var item_ID in this.get("items") ){
          var item = this.store.find('item',{'_id':item_ID});
          layout = layout + '<li data-row="'+ item.row.toString()+'"';
          layout = layout +' data_col="'+ item.col.toString()+'"';
          layout = layout +' data-sizex="'+ item.rowspan.toString()+'"';
          layout = layout +' data-sizey="'+ item.colspan.toString()+'">'+item._id+'</li>';
        }
        layout = layout + '</ul>';
        console.log(layout);
        return layout;
      },
      
    action: { 



      resizeItem: function( itemId ){
            var itemList = this.get("items");

        }
    }
});

return Application.ContainerController;
});
