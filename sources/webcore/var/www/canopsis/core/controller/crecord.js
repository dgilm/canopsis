define([
	'jquery',
	'app/lib/ember',
	'app/application',
	'app/model/crecord'
], function($, Ember, Application, Account) {

	Application.CrecordController = Ember.ObjectController.extend({
		actions: {
			show_add_crecord_form: function(crecord_type){
				crecordformController = Application.CrecordformController.create();
				crecordformController.crecord_type = crecord_type;

				this.render("crecordform", {
					outlet: 'popup',
					controller: crecordformController
				});
			}
		}
	});

	return Application.CrecordController;
});