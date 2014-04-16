define([
	'jquery',
	'app/lib/ember',
	'app/lib/ember-data',
	'app/application',
    'app/model/widget'
], function($, Ember, DS, Application){

	Application.Container = Application.Widget.extend({
        items : DS.hasMany('Application.Item'),
        layout_cols : DS.attr('number'),
        layout_rows : DS.attr('number')
	});

	Application.Container.reopenClass({

		find: function(store, authkey) {
			console.log("Container find");
			return $.ajax({
				url: '/rest/object/widget',
				method: 'GET',
				contentType: 'application/json',
				data: { widget_type:"container",
						authkey: authkey }
			});
		},

		findAll: function(store, authkey) {
			console.log("Container findAll");
			return $.ajax({
				url: '/rest/object/widget',
				method: 'GET',
				contentType: 'application/json',
				data: { widget_type:"container",
				        authkey: authkey}
			});
		},

		extractFindAll: function(store, payload) {
			var containers = [];
			console.log("Container extractFindAll", payload);

			for(var i = 0; i < payload.data.length; i++) {
				var container = payload.data[i];

				containers.push( container );
			}

			return containers;
		},

		extractFind: function(store, payload) {
			var containers = [];
			console.log("Container extractFind", payload);
			for(var i = 0; i < payload.data.length; i++) {
				var container = payload.data[i];

				containers.push( container );
			}
			return containers;
		},

		extractSingle: function(store, type, payload, id, requestType) {
			var container = payload.data;
			console.log("Container extractSingle", payload);
			return container;
		}
	});

	return Application.Container;
});
