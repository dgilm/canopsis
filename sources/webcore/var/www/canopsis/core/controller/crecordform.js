/*
# Copyright (c) 2014 "Capensis" [http://www.capensis.com]
#
# This file is part of Canopsis.
#
# Canopsis is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Canopsis is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
*/

define([
	'jquery',
	'app/lib/ember',
	'app/application',
	'app/lib/schema-manager'
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
		}.property("record_raw"),

		//getting attributes (keys and values as seen on the form)
		categorized_attributes: function() {
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

				var categories = Ember.copy(referenceModel.proto().categories);
				var modelAttributes = Ember.get(referenceModel, 'attributes');

				var attributes = [];

				for (var i = 0; i < categories.length; i++) {
					var category = categories[i];

					for (var j = 0; j < category.keys.length; j++) {
						var key = category.keys[j];

						if(typeof key === "object") {
							key = key.field;
						}
						category.keys[j] = {field: key, model: modelAttributes.get(key), value: getValueForField(key)};
					}
				};

				modelAttributes.forEach(function(field, attrModel) {
					if(attrModel.options.category === undefined)
						attrModel.options.category = "General";

					categories.push({field: field, model: attrModel, value: getValueForField(field)});
				});

				return categories;
			}
			else {
				return undefined;
			}
		}.property("record_raw")
	});

	return Application.CrecordformController;
});