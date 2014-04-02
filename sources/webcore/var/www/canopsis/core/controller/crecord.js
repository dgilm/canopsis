define([
	'jquery',
	'app/lib/ember',
	'app/application',
	'app/model/crecord'
], function($, Ember, Application, Account) {

	Application.CrecordController = Ember.ObjectController.extend({
		actions: {
			showEditForm: function() {
				// console.log("CrecordController::showEditForm", this, this.get("content"));

				crecordformController = Application.CrecordformController.create();

				crecordformController = Application.CrecordformController.create();
				crecordformController.set("crecord_type", this.get("model.crecord_type"));
				crecordformController.set("record_raw", this.get(this.dataAccessKey));
				crecordformController.set("editMode", "edit");
				crecordformController.set("editedRecordController", this);

				this.send('showEditFormWithController', crecordformController);
			},
			editRecord: function(record_raw){
				console.log("editRecord", record_raw);
				//TODO the rest api doesn't handle well this case
				this.get("model").setProperties(record_raw);
				this.get("model").save();
			}
		},

		remove: function() {
			this.get("model").deleteRecord();
			this.get("model").save();
		},
		//key to access data that was put on the model
		dataAccessKey: "content._data"
	});

	return Application.CrecordController;
});