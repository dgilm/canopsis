define([
	'jquery',
	'app/lib/ember',
	'app/application'
], function($, Ember, Application) {

	Application.EditorView = Ember.View.extend({
		templateName: function() {
			if(Ember.TEMPLATES["editor-"+ this.get('content.model.type')] !== undefined )
				return "editor-"+ this.get('content.model.type');
			else
				return "editor-defaultpropertyeditor";
		}.property('content.template').cacheable(),

		_templateChanged: function() {
			this.rerender();
		}.observes('templateName')
	});

	return Application.EditorView;
});