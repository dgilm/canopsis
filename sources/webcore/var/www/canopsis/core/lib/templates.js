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

var templates = [
	'login',
	'application',
	'accounts',
	'groups',
	'curves',
	'perfdatas',
	'selectors',
	'consolidations',
	'userviews',
	'userview',
	'widget',
    'item',
    'container',
	'crecordform',
	'menu',
	'widget-titlebar'
];

var deps = ['app/lib/ember', 'app/lib/mmenu'];
var depsSize = deps.length;

for(var i = 0; i < templates.length; i++) {
	deps.push('text!app/templates/' + templates[i] + '.html');
}

define(deps, function(Ember) {
	for(var i = depsSize; i < arguments.length; i++) {
		var templateName = templates[i - depsSize];
		Ember.TEMPLATES[templateName] = Ember.Handlebars.compile(arguments[i]);
	}
});
