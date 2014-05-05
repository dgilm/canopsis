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
	'app/routes/paginated',
	'app/mixins/pagination',
	'app/lib/schema-manager'
], function($, Ember, Application, PaginatedRoute) {

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

	Application.CrecordsController = Ember.ArrayController.extend(Ember.PaginationMixin, {
		toolbar: [{
			title: 'Refresh',
			action: 'refresh',
			icon: 'refresh'
		},{
			title: 'Add',
			action: 'showAddForm',
			icon: 'plus-sign'
		},{
			title: 'Duplicate',
			action: 'duplicate',
			icon: 'file'
		},{
			title: 'Remove',
			action: 'remove',
			icon: 'trash'
		},{
			title: 'Import',
			action: 'import',
			icon: 'import'
		},{
			title: 'Export',
			action: 'export',
			icon: 'open'
		}],

		itemController: "Crecord",

		actions: {
			do: function(action) {
				this.send(action);
			},

			//add record to the crecord array
			addRecord: function(crecord_type, raw_record) {
				raw_record[crecord_type] = crecord_type;

				var record = this.store.createRecord(crecord_type, raw_record);

				//send the new item via the API
				record.save();
			},
			showAddForm: function() {
				this.send('show_add_crecord_form', this.get("content").type.typeKey);
			},
			remove: function(){
				var selected = this.filterBy('isSelected', true);
				console.log("remove action", selected);
				selected.invoke('remove');
			}
		},

		attributesKeys: function() {
			var attributes = [];
			var attributesDict = this.get('content.type.attributes.values');

			for(key in attributesDict) {
				var attr = attributesDict[key];
				console.log('isAttrHidden? ', attr.name, attr.options.hiddenInLists, attr.options.hiddenInLists !== false);
				if(attr.options.hiddenInLists === false || attr.options.hiddenInLists === undefined) {
					attributes.push({
						field: attr.name,
						type: attr.type,
						options: attr.options
					});
					console.log("pushed attr", {
						field: attr.name,
						type: attr.type,
						options: attr.options
					});
				}
			};
			return attributes;
		}.property('content')
	});

	return Application.CrecordsController;
});