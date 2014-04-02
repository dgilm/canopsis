define([
	'jquery',
	'app/lib/ember',
	'app/lib/ember-data',
	'app/application'
], function($, Ember, DS, Application) {
	Application.Crecord = DS.Model.extend({
		_id: DS.attr('string', { hiddenInForm: true }),
		crecord_type: DS.attr('string', { hiddenInForm: true })
	});

	return Application.Crecord;
});