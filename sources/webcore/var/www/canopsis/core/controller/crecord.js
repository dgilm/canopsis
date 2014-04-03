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
	'app/model/crecord'
], function($, Ember, Application, Account) {

	Application.CrecordController = Ember.ObjectController.extend({
		actions: {
			showEditForm: function() {
				console.log("CrecordController::showEditForm", this.get(this.dataAccessKey));
				console.log("editors based on", this.get("model.constructor.typeKey"));
				console.log("changedAttributes", this.get('model').changedAttributes());

				crecordformController = Application.CrecordformController.create();
				crecordformController.set("crecord_type", this.get("model.constructor.typeKey"));
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