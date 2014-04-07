define([
	'jquery',
	'app/lib/ember',
	'app/lib/ember-data',
	'app/application',
    'app/model/widget'
], function($, Ember, DS, Application){
    /*
	Application.Container = Application.Widget.extend({
        items : DS.attr('array'),
        layout_type : DS.attr('string',{defaultValue: 'vertical'} ),
        layout_cols : DS.attr('number',{ defaultValue:0}),
        layout_rows : DS.attr('number',{ defaultValue:5})
	});
*/
	return Application.Container;
});
