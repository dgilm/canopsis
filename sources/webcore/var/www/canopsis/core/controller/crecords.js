define([
	'jquery',
	'app/lib/ember',
	'app/application',
	'app/model/crecord'
], function($, Ember, Application, Crecord) {

	Application.CrecordsController = Ember.ArrayController.extend({
		toolbar: [{
			title: 'Refresh',
			action: 'refresh',
			icon: 'refresh'
		},{
			title: 'Add',
			action: 'add',
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
			add: function() {
				this.controllerFor('application').send('show_add_crecord_form', this.get("content").type.typeKey);
			},
			remove: function(){
				this.removeObjects(this.filterBy('isSelected', true));
			}
		}
	});

	return Application.CrecordsController;
});