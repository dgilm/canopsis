define([
	'jquery',
	'app/lib/ember',
	'app/application'
], function($, Ember, Application) {

	Application.MenuView = Ember.View.extend({
		actions: {
			showmenu: function() {
				console.log("showing mmenu (app)");
			},
			menuAction: function() {
				console.old.log("Action");
				console.old.log(arguments);

				//convert args to array
				var args = Array.prototype.slice.call(arguments);
				var actionName = args.shift();

				// this.get('controller.controllers.another').send('someAction');
				this.send(actionName, args);
			}
		},
		templateName: 'menu',
		items: function() {
			console.log("menu selector result");

			var selectorResult = JSONSelect.match(this.get('selector'), Application.manifest);

			if(selectorResult === undefined)
				selectorResult = [];
			if(!selectorResult.toArray === undefined)
				selectorResult = [selectorResult];

			console.log(selectorResult);
			return selectorResult;
		}.property('items'),

		isAction: function (scenarioStep) {
			return scenarioStep.type === "action";
		}
	});

	return Application.MenuView;
});