define([
	'jquery',
	'app/lib/ember',
	'app/lib/ember-data',
	'app/application',
	'app/model/crecord'
], function($, Ember, DS, Application) {
	Application.Userview = Application.Crecord.extend({
		enable: DS.attr('boolean'),

		_id: DS.attr('string'),
		name: DS.attr('string')

	});

	Application.Userview.reopenClass({
		findAll: function(store, authkey) {
			return $.ajax({
				url: '/rest/object/view',
				method: 'GET',
				contentType: 'application/json',
				data: {
					authkey: authkey
				}
			});
		},

		extractFindAll: function(store, payload) {
			var userviews = [];

			for(var i = 0; i < payload.data.length; i++) {
				var userview = payload.data[i];

				userview.name = userview._id;
				userviews.push(userview);
			}

			return userviews;
		}
	});

	return Application.Userview;
});