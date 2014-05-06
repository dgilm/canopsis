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
	'app/mixins/inspectablearray',
	'app/mixins/arraysearch',
	'app/lib/schema-manager'
], function($, Ember, Application, PaginatedRoute, PaginationMixin, InspectableArrayMixin, ArraySearchMixin) {

	Application.CrecordsController = Ember.ArrayController.extend(PaginationMixin, InspectableArrayMixin, ArraySearchMixin, {
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

		findItems: function(callback) {
			var me = this;
			this.store.findQuery(this.itemType, this.findOptions).then(function(queryResult) {
				callback(queryResult);
				me.set("content", queryResult);
			});
		}
	});

	return Application.CrecordsController;
});