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

define(['moment',
	'app/lib/ember',
	'app/application',
	'app/view/menu'
], function(moment, Ember, Application) {
	Ember.Handlebars.helper('glyphicon', function(icon) {
		return new Ember.Handlebars.SafeString('<span class="glyphicon glyphicon-' + icon + '"></span>');
	});

	Ember.Handlebars.helper('enableview', function(enable) {
		return new Ember.Handlebars.SafeString('<div class="canopsis-divicon canopsis-' + (enable ? 'enabled' : 'disabled') + '"></div>');
	});

	Ember.Handlebars.helper('colorview', function(color) {
		return new Ember.Handlebars.SafeString('<div style="width: 24px; height: 24px; margin: auto; background-color: ' + color + ';"></div>');
	});

	Ember.Handlebars.helper('stateview', function(state, options) {
		var classNames = 'canopsis-state-unknown';

		if(state === 0) {
			classNames = 'canopsis-state-ok';
		}
		else if(state === 1) {
			classNames = 'canopsis-state-warning';
		}
		else if(state === 2) {
			classNames = 'canopsis-state-critical';
		}

		if(options.hash.center) {
			classNames = classNames + ' canopsis-divicon';
		}
		else {
			classNames = classNames + ' canopsis-icon';
		}

		return new Ember.Handlebars.SafeString('<div class="' + classNames + '"></div>')
	});

	Ember.Handlebars.helper('date-fromnow', function(timestamp) {
		if(timestamp) {
			return new Ember.Handlebars.SafeString(moment.unix(timestamp).fromNow());
		}
		else {
			return new Ember.Handlebars.SafeString('');
		}
	});

	Ember.Handlebars.helper('duration', function(timestamp) {
		if(timestamp) {
			timestamp = parseInt(timestamp);

			var dt = {
				days: 0,
				hours: 0,
				minutes: 0,
				seconds: timestamp
			};

			dt.minutes = parseInt(dt.seconds / 60);
			dt.seconds -= (dt.minutes * 60);

			dt.hours = parseInt(dt.minutes / 60);
			dt.minutes -= (dt.hours * 60);

			dt.days = parseInt(dt.hours / 24);
			dt.hours -= (dt.days * 24);

			var str = "";

			if(dt.days > 0) {
				str += dt.days + ' day' + (dt.days > 1 ? 's ' : ' ');
			}

			if(dt.hours > 0) {
				str += dt.hours + ' h ';
			}

			if(dt.minutes > 0) {
				str += dt.minutes + ' min ';
			}

			if(dt.seconds > 0) {
				str += dt.seconds + ' s';
			}

			return new Ember.Handlebars.SafeString(str);
		}
		else {
			return new Ember.Handlebars.SafeString('');
		}
	});

	Ember.Handlebars.helper('format-date', function(timestamp) {
		if(timestamp) {
			return new Ember.Handlebars.SafeString(moment.unix(timestamp));
		}
		else {
			return new Ember.Handlebars.SafeString('');
		}
	});

	// Ember.Handlebars.registerBoundHelper('editor', function(context, attr, value, options) {
	// 	var typeName = attr;
	// 	var editorName = "editors-" + attr;

	// 	if(Ember.TEMPLATES[editorName] === undefined) {
	// 		editorName = "editor-defaultpropertyeditor";
	// 	}
	// 	return Ember.Handlebars.helpers.partial.call(context, editorName, options);
	// });

	Ember.Handlebars.helper('menu', Application.MenuView);
	Ember.Handlebars.helper('editor', Application.EditorView);

	Ember.Handlebars.registerHelper('ifeq', function(a, b, options) {
		return Ember.Handlebars.helpers.bind.call(options.contexts[0], a, options, true, function(result) {
			return result === b;
		});
	});
	Ember.Handlebars.registerBoundHelper('log', function(message, options) {
		console.log(message);
		return '';
	});
});
