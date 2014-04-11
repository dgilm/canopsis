define([
	'jquery',
	'app/lib/ember',
	'app/lib/ember-data',
	'app/application',
	'app/lib/schema-manager'
], function($, Ember, DS, Application) {
	Application.Timegraph = Application.Crecord.extend({
		name: DS.attr('string'),
		description: DS.attr('string'),
		timegraphAttribute: DS.attr('string')
	});

	return Application.Timegraph;
});