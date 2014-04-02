define([
	'jquery',
	'app/lib/ember',
	'app/application',
	'app/model/crecord'
], function($, Ember, Application, CrecordModel) {
	var eventedController = Ember.Controller.extend(Ember.Evented);

	Application.CrecordformController = eventedController.extend({
		actions: {
			saveRecord: function() {
				console.log("addRecord from CrecordformController, editMode:", this.editMode);
				console.log(this);

				if(this.editMode === "add") {
					var mainCrecordController = Application.Router.router.currentHandlerInfos[2].handler.controller;
					mainCrecordController.send('addRecord', this.crecord_type, this.get("attributes"));
				}
				else if(this.editMode === "edit") {
					var newRecord = {};
					for (var i = 0; i < this.get("attributes").length; i++) {
						var attr = this.get("attributes")[i];
						newRecord[attr.field] = attr.value;
					}

					this.editedRecordController.send("editRecord", newRecord);
				}
				else {
					console.error("bad record form mode");
				}

				//reset editmode to avoid unpredictable behaviour later
				this.editMode = undefined;
				this.trigger("validate");
			}
		},

		//getting attributes (keys and values as seen on the form)
		attributes: function() {
			var crecord_type = this.crecord_type;
			var record_raw = this.record_raw;

			function getValueForField(field) {
				if(record_raw !== undefined) {
					return record_raw[field];
				}

				return undefined;
			};

			if(crecord_type !== undefined) {
				var referenceModel = Application[crecord_type.capitalize()];

				var modelAttributes = Ember.get(referenceModel, 'attributes');

				var attributes = [];
				modelAttributes.forEach(function(field, attrModel) {
					attributes.push({field: field, model: attrModel, value: getValueForField(field)});
				});

				return attributes;
			}
			else {
				return undefined;
			}
		}.property("record_raw")
	});

	return Application.CrecordformController;
});