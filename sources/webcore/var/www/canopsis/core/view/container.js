define([
	'jquery',
	'app/lib/ember',
	'app/application',
	'app/view/widget'
], function($, Ember, Application) {

	Application.ContainerView = Application.WidgetView.extend({
		templateName:'container',
		
	});

	return Application.ContainerView;
});