define([
	'jquery',
	'app/lib/ember',
	'app/application',
	'app/model/crecord'
], function($, Ember, Application, CrecordModel) {
	var eventedController = Ember.Controller.extend(Ember.Evented);

	Application.CrecordformController = eventedController.extend({
		actions: {
			addRecord: function() {
				var mainCrecordController = Application.Router.router.currentHandlerInfos[2].handler.controller;
				mainCrecordController.send('addRecord', this.crecord_type, this.get("attributes"));
				this.send("hideModal");
			}
		},

		crecord_type: undefined,

		//getting attributes (keys and values as seen on the form)
		attributes: function() {
			var crecord_type = this.crecord_type;

			if(crecord_type !== undefined) {
				var referenceModel = Application[crecord_type.capitalize()];

				var modelAttributes = Ember.get(referenceModel, 'attributes');

				var attributes = [];
				modelAttributes.forEach(function(field, attrModel) {
					attributes.push({field: field, model: attrModel});
				});

				return attributes;
			}
			else {
				return undefined;
			}
		}.property()
	});

	return Application.CrecordformController;
});