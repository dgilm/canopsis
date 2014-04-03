define([
	'jquery',
	'app/lib/ember',
	'app/application',
	'components/widgets/timegraph/model.js'
], function($, Ember, Application, Timegraph) {

	Application.WidgetTimegraphController = Application.WidgetController.extend({

	});

	return Application.WidgetTimegraphController;
});