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
