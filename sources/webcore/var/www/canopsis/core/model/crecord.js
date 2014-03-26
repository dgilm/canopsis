define([
	'jquery',
	'app/lib/ember',
	'app/lib/ember-data',
	'app/application'
], function($, Ember, DS, Application) {
	Application.Crecord = DS.Model.extend({
		crecord_type: DS.attr('string', { hiddenInForm: true })
	});

	return Application.Crecord;
});