define([
	'jquery',
	'app/lib/ember',
	'app/lib/ember-data',
	'app/application',
	'app/model/crecord'
], function($, Ember, DS, Application) {
	Application.Consolidation = Application.Crecord.extend({
		loaded: DS.attr('boolean', {defaultValue: false, hiddenFromForm:true}),
		enable: DS.attr('boolean'),

		name: DS.attr('string'),
		component: DS.attr('string'),
		resource: DS.attr('string'),

		aggregation_interval: DS.attr('number'),
		aggregation_method: DS.attr('string'),
		consolidation_method: DS.attr('string'),

		message: DS.attr('string'),
		nb_items: DS.attr('number')
	});

	Application.Consolidation.reopenClass({
		findAll: function(store, authkey) {
			return $.ajax({
				url: '/rest/object/consolidation',
				method: 'GET',
				contentType: 'application/json',
				data: {
					authkey: authkey
				}
			});
		},

		extractFindAll: function(store, payload) {
			var consolidations = [];

			for(var i = 0; i < payload.data.length; i++) {
				var conso = payload.data[i];

				conso.name = conso.crecord_name;
				conso.message = conso.output_engine;

				consolidations.push(conso);
			}

			return consolidations;
		}
	});

	return Application.Consolidation;
});