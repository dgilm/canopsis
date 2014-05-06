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
	'app/lib/ember-data',
	'app/application',
	'app/routes/paginated'
], function($, Ember, DS, Application, PaginatedRoute) {

	Application.CrecordsRoute = PaginatedRoute.extend({
		actions: {
			show_add_crecord_form: function(crecord_type, model){
				var crecordformController = Application.CrecordformController.create({container: this.container});
				crecordformController.set("crecord_type", crecord_type);
				crecordformController.set("editMode", "add");

				this.render("crecordform", {
					outlet: 'popup',
					controller: crecordformController
				});
			},
			showEditFormWithController: function(crecordformController) {
				crecordformController.set("container", this.container);
				this.render("crecordform", {
					outlet: 'popup',
					controller: crecordformController
				});
			}
		}
	});

	return Application.CrecordsRoute;
});
