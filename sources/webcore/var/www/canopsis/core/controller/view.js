define([
'jquery',
'app/lib/ember',
'app/application',
'app/model/view'
], function($, Ember, Application, view ){

    Application.ViewController = Ember.WidgetController.extend({

    needs:"item",
    item:Ember.computed.alias("controllers.item"),

    createView : function( idView, title,layout_type, layout_rows, layout_cols ){
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

        var view = this.store( 'view', { '_id':idview,
                                         'title':title,
                                         'items': itemList,
                                         'layout_type':layout_type,
                                         'layout_rows':layout_rows,
                                         'layout_cols':layout_cols });
        
        view.save();

    },
 
    action: { 
         addItem: function( idview ){
            var view = this.store.find( 'view',idview);
            
            itemList[item.get('id')] = item ;
        },

        displayItems : function (idview){
            var view = this.store.find('view',idview);
            var itemList = view.items;
            $.each( this.get("items"),function( item ){ item});  
        },

        resizeItem: function( itemId ){
            var itemList = this.get("items");

        }
    }
});

return Application.viewController;
