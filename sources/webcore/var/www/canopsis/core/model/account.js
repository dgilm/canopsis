define([
	'jquery',
	'app/lib/ember',
	'app/lib/ember-data',
	'app/application',
	'app/model/crecord'
], function($, Ember, DS, Application) {
	Application.Account = Application.Crecord.extend({
		enable: DS.attr('boolean'),
		user: DS.attr('string', {description: "the user name"}),
		firstname: DS.attr('string'),
		lastname: DS.attr('string'),
		mail: DS.attr('mail'),
		group: DS.attr('string'),
		groups: DS.attr('array')
	});

	Application.Account.reopenClass({
		findAll: function(store, authkey) {
			return $.ajax({
				url: '/account/',
				method: 'GET',
				contentType: 'application/json',
				data: {
					authkey: authkey
				}
			});
		},

		extractFindAll: function(store, payload) {
			var data = [];
			for(var i = 0; i < payload.data.length; i++) {
				var account = payload.data[i];

				account.group = account.aaa_group.substring('group.'.length);
				delete account.aaa_group;

				for(var j = 0; j < account.groups.length; j++) {
					account.groups[j] = account.groups[j].substring('group.'.length);
				}

				data.push(account);
			}

			return data;
		}
	});

	return Application.Account;
});