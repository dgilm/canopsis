define([
	'jquery',
	'app/lib/ember',
	'app/application',
	'components/widgets/timegraph/controller'
], function($, Ember, Application, WidgetTimegraphController) {
	Application.WidgetTimegraphView = Application.WidgetView.extend({
		controller: WidgetTimegraphController
	});

	return Application.WidgetTimegraphView;
});