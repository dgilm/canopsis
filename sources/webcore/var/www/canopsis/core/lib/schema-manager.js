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


//TODO implement auto check for mvct file existence and require them automatically

var schemaFiles = [
	'crecord',
	'crecord.account',
	'crecord.group',
	'crecord.consolidation',
	'crecord.selector'
];

var schemasDeps = ['app/lib/ember', 'app/lib/ember-data', 'app/application'];
var schemasDepsLength = schemasDeps.length;

for(var i = 0; i < schemaFiles.length; i++) {
	schemasDeps.push('text!schemas/' + schemaFiles[i] + '.json');
}

define(schemasDeps, function(Ember, DS, Application) {

	for(var i = schemasDepsLength; i < arguments.length; i++) {
		console.log(i, schemasDepsLength, arguments.length);
		var schemaIndex =  i - schemasDepsLength;

		var schema = JSON.parse(arguments[i]);
		var schemaName = schemaFiles[schemaIndex].capitalize();
		var schemaInheritance = schemaFiles[schemaIndex].split(".");

		var modelClass = DS.Model;

		if(schemaInheritance.length > 1) {
			modelClass = Application[schemaInheritance[schemaInheritance.length - 2].capitalize()];
			schemaName = schemaInheritance[schemaInheritance.length - 1].capitalize();
			console.log("new schema name", schemaName);
		}

		console.log(schemaFiles[schemaIndex].split("."));

		var modelDict = {};

		// console.log("loaded argument", schema, schemaFiles[schemaIndex]);

		for(name in schema.properties) {
			var property = schema.properties[name];
			var propertyType = property.type;
			delete property.type
			modelDict[name] = DS.attr(property.type, property);
		}
		console.log("modelDict", schemaName, modelDict);
		Application[schemaName] = modelClass.extend(modelDict);
	}
});