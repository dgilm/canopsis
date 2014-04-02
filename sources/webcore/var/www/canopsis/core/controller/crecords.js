define([
	'jquery',
	'app/lib/ember',
	'app/application',
	'app/model/crecord'
], function($, Ember, Application, Crecord) {

	Application.CrecordsRoute = Application.AuthenticatedRoute.extend({
		actions: {
			show_add_crecord_form: function(crecord_type, model){
				var crecordformController = Application.CrecordformController.create();
				crecordformController.set("crecord_type", crecord_type);
				crecordformController.set("editMode", "add");

				this.render("crecordform", {
					outlet: 'popup',
					controller: crecordformController
				});
			},
			showEditFormWithController: function(crecordformController) {
				this.render("crecordform", {
					outlet: 'popup',
					controller: crecordformController
				});
			}
		}
	});

	Application.CrecordsController = Ember.ArrayController.extend({
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
			addRecord: function(crecord_type, model) {
				var raw_record = {};

				raw_record[crecord_type] = crecord_type;

				model.forEach(function(attr) {
					if(attr.value !== undefined) {
						raw_record[attr.field] = attr.value;
					}
				});

				var record = this.store.createRecord(crecord_type, raw_record);
				console.log("addrecord record");
				console.log(record);

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
    			// selected.invoke('save');
			}
		}
	});

	return Application.CrecordsController;
});