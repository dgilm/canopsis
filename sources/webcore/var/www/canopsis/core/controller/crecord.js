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
], function($, Ember, Application, Account) {

	Application.CrecordController = Ember.ObjectController.extend({
		actions: {
			showEditForm: function() {
				var crecord_type = this.get("model.constructor.typeKey");
				console.log("Form generation for", crecord_type);

				crecordformController = Application.CrecordformController.create();
				crecordformController.set("crecord_type", crecord_type);
				crecordformController.set("editMode", "edit");
				crecordformController.set("editedRecordController", this);

				this.send('showEditFormWithController', crecordformController);
			},

			editRecord: function(record_raw){
				console.log("editRecord", record_raw);
				this.get("model").setProperties(record_raw);
				this.get("model").save();
			},
		},

		remove: function() {
			this.get("model").deleteRecord();
			this.get("model").save();
		},

		//This is where to get data from the crecord. It should not be changed, and is for internal use only
		dataAccessKey: "content._data",

		attributes: function() {
			var attributes = [];
			var attributesDict = this.parentController.get("attributesKeys");

			for(key in attributesDict) {
				if(attributesDict[key] !== undefined) {
					var attr = attributesDict[key];
					if(attr.options !== undefined && (attr.options.hiddenInLists === false || attr.options.hiddenInLists === undefined)) {

						var rendererName;

						if(attr.options !== undefined && attr.options.role !== undefined){
							rendererName = "renderer-" + attr.options.role;
						} else {
							rendererName = "renderer-" + attr.type;
						}

						if(Ember.TEMPLATES[rendererName] === undefined) {
							rendererName = "renderer-default";
						}

						attributes.push({
							field: attr.field,
							type: attr.type,
							options: attr.options,
							renderer: attr.options.role,
							value: this.content.get(attr.field),
							renderer: rendererName
						});
					}
				}
			};
			return attributes;

		}.property('content')
	});

	return Application.CrecordController;
});