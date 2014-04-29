define([
'jquery',
'app/lib/ember',
'app/application',
'app/model/item'
], function($, Ember, Application, Item ){

    Application.ItemController = Ember.ObjectController.extend({
        needs:["widget"],
        createItem : function( idItem,row,col ){
            this.set('_id',idItem);
            this.set('row',row);
            this.set('col',col);
            var item = this.store('item',{'_id': idItem,
                                          'widget': {},
                                          'row': row,
                                          'col': col,
                                          'rowspan': 1,
                                          'colspan':1,
                                          'isSelected': true,
                                          'isActivated': false });
            item.save();
        },
        
        addWidget:function( widget ){
            this.set("widget",widget);
            var item = this.store.find( 'item',this.get('_id'));
            item.widget = widget;
            item.save();
            
        },
        
        removeWidget : function(){
            this.set("widget",{});
            var item = this.store.find( 'item',this.get('_id'));
            item.widget = {};
            item.save()
        },

        modifyItemActivation : function( activation ){
                this.set('activated',activation );
            },
        
        action: {               
            
            modifyItemSelection : function( selection ){
               this.set('selected',selection );
            },

            displayItem : function(){
                this.get("widget").displayAction();
            }
        }

    } );
    return Application.ItemController;
  });


