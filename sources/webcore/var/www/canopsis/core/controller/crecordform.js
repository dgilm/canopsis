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
				console.log("saveRecord edited crecord controller", this.editedRecordController);

				if(this.editMode === "add") {
					var mainCrecordController = Application.Router.router.currentHandlerInfos[2].handler.controller;

					var newRecord = {};
					var categories = this.get("categorized_attributes");
					for (var i = 0; i < categories.length; i++) {
						var category = categories[i];
						for (var i = 0; i < category.keys.length; i++) {
							var attr = category.keys[i];
							newRecord[attr.field] = attr.value;
						};
					}

					mainCrecordController.send('addRecord', this.crecord_type, newRecord);
				}
				else if(this.editMode === "edit") {
					var newRecord = {};
					var categories = this.get("categorized_attributes");
					for (var i = 0; i < categories.length; i++) {
						var category = categories[i];
						for (var i = 0; i < category.keys.length; i++) {
							var attr = category.keys[i];
							newRecord[attr.field] = attr.value;
						};
					}

					this.editedRecordController.send("editRecord", newRecord);
				}
				else {
					console.log("bad record form mode");
				}

				//reset editmode to avoid unpredictable behaviour later
				this.editMode = undefined;
				this.trigger("validate");
			}
		},

		//getting attributes (keys and values as seen on the form)
		categorized_attributes: function() {
			var crecord_type = this.crecord_type;

			var me = this;
			function getValueForField(field) {
				console.log("me.editedRecordController", me.editedRecordController.get(field));
				if(this.editedRecordController !== undefined) {
					return me.editedRecordController.get(field);
				}

				return undefined;
			};

			if(crecord_type !== undefined) {
				var referenceModel = Application[crecord_type.capitalize()];

				this.categories = [];

				var modelAttributes = Ember.get(referenceModel, 'attributes');

				for (var i = 0; i < referenceModel.proto().categories.length; i++) {
					var category = referenceModel.proto().categories[i];
					var createdCategory = [];
					createdCategory.title = category.title;
					createdCategory.keys = [];

					for (var j = 0; j < category.keys.length; j++) {
						var key = category.keys[j];

						if(typeof key === "object") {
							key = key.field;
						}

						//find appropriate editor for the model property
						var editorName;
						var attr = modelAttributes.get(key);

						if(attr.options !== undefined && attr.options.role !== undefined){
							editorName = "editor-" + attr.options.role;
						} else {
							editorName = "editor-" + attr.type;
						}

						if(Ember.TEMPLATES[editorName] === undefined) {
							editorName = "editor-defaultpropertyeditor";
						}

						createdCategory.keys[j] = {
							field: key,
							model: modelAttributes.get(key),
							editor: editorName
						};

						if(me.editedRecordController !== undefined)
							createdCategory.keys[j].value = me.editedRecordController.get(key)
						else
							createdCategory.keys[j].value = undefined;

						console.log("category key", category.keys[j].value);
					}

					this.categories.push(createdCategory);
				};

				return this.categories;
			}
			else {
				return undefined;
			}
		}.property("editedRecordController")
	});

	return Application.CrecordformController;
});