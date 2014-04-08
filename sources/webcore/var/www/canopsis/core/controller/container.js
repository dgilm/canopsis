define([
'jquery',
'app/lib/ember',
'app/application',
'app/model/container'
], function($, Ember, Application, Container ){

    Application.ContainerController = Application.WidgetController.extend({

    needs:"item",
    item:Ember.computed.alias("controllers.item"),

    createContainer : function( idContainer, title,layout_type, layout_rows, layout_cols ){
        var itemList = {};
        var n = 0;
        var idItem ="";

        for(var row=0; row < layout_rows; row++){
            for (var col=0; col < layout_cols ;col++){
                n=(row+1)*(col+1);
                idItem = this.get("id")+'_'+ n.toString();
                itemList[ idItem ] = item.createItem( idItem,row,col );
            }
        }

        var container = this.store( 'container', { '_id':idContainer,
                                                   'title':title,
                                                   'type': 'container',
                                                   'items': itemList,
                                                   'layout_type':layout_type,
                                                   'layout_rows':layout_rows,
                                                   'layout_cols':layout_cols
                                                      });
        container.save();

    },
 
    action: { 
         addItem: function( idContainer ){
            var container = this.store.find( 'container',idContainer);
            
            itemList[item.get('id')] = item ;
        },

        displayItems : function (idContainer){
            var container = this.store.find('container',idContainer);
            var itemList = container.items;
            $.each( this.get("items"),function( item ){ item});  
        },

        resizeItem: function( itemId ){
            var itemList = this.get("items");

        }
    }
});

return Application.ContainerController;
});
