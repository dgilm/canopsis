define([
	'jquery',
	'app/lib/ember',
	'app/application',
	'app/controller/crecord'
], function($, Ember, Application) {

	Application.WidgetController = Application.CrecordController.extend({
		actions: {
			showEditForm: function() {
				console.log("WidgetController::showEditForm", this, this.get("content"));

				crecordformController = Application.CrecordformController.create();

				crecordformController = Application.CrecordformController.create();
				crecordformController.set("crecord_type", this.get("model.crecord_type"));
				crecordformController.set("record_raw", this.get(this.dataAccessKey));

				this.send('showEditFormWithController', crecordformController);
			}
		},

		dataAccessKey: "content._attributes"
	});

	return Application.WidgetController;
});
