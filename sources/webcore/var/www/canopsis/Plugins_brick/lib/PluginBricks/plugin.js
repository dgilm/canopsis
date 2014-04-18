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


require("./array.js");

var Plugins = {

    /*
    # plug, dep_plug -> plugin objects
    # Check if two plugins depends on each other
    */
    checkConflicts: function(plug, dep_plug) {
	if (dep_plug.dependancies)
	    for (var i = 0; i < dep_plug.dependancies.length; ++i)
		if (!~plug.dependancies.indexOf(dep_plug.dependancies[i]))
		    return ('Conflicting dependancies between "'
			    + dep_plug.name
			    + '" and "'
			    + plug.name + '"');
    },

    /*
    # plugins -> list of plugin objects (see getPugins)
    # Sort the list to load the needed plugins first
    */
    resolveDependancies: function(plugins) {
	for (var i = 0; i < plugins.length; ++i) {
	    var c_plugin = plugins[i];

	    if (c_plugin.dependancies)
		for (var j = 0; j < c_plugin.dependancies.length; ++j) {
		    var elem = c_plugin.dependancies[j];
		    var p_pos = plugins.findIndex(c_plugin.name);
		    var dep_pos = plugins.findIndex(elem);

		    if ((error = Plugins.checkConflicts(c_plugin, plugins[dep_pos])))
			throw (error);
		    if (dep_pos == -1) throw ("Missing plugin: " + elem);
		    else if (dep_pos > p_pos) {
			plugins.splice(dep_pos+1, 0, c_plugin);
			plugins.splice(p_pos, 1);
			i = -1;
		    }
		}
	}
	return (plugins);
    },

    /*
    # Get list of enabled plugins
    */
    getEnabled: function(path) { return (require(path + "enabled.json")); },


    /*
    # Get list of plugin objects
    */
    getPlugins: function(path) {
	var list = this.getEnabled(path);

	return (list.map(function(elem, i) {
	    return (require(path + elem + "/files/manifest.json"));
	}));
    }
}

/*
# Test deep equality (i.e. every field besides arrays) between two objects
*/
function areEquals(fst, scnd) {
    for (key_ in fst) {
	if (!Array.isArray(fst[key_]) && fst[key_] != scnd[key_])
	    return (false);
    }
    return (true);
}

var Manifest = {

    /*
    # original -> array to filter
    # Remove duplicates and merge sub-level arrays recursively
    */
    format: function(original) {
	var cObj, tObj = {};
	var merged = [];
	var unique = false;


	while (original.length) {
	    cObj = original.pop();

	    for (var i = 0; i < original.length; ++i) {
		tObj = original[i];

		for (key in cObj) {
		    if (Array.isArray(cObj[key]) && areEquals(cObj, tObj)) {
			tObj[key] = this.format(cObj[key].concat(tObj[key]));
			original[i] = tObj;
		    }
		    else if (tObj[key] != cObj[key]) {
			unique = true; break;
		    }
		    unique = false;
		}
		if (!unique) break;
	    }
	    unique && merged.push(cObj);
	    unique = true;
	}
	return (merged.reverse());
    },

    /*
    # list -> list of plugin objects
    # Fetch JSON routes files from the manifest of each and every plugin
    # Merge them in a depth-1 array without duplicates
    */
    fetchRoutes: function(list) {
	return (this.format(list.map(function(elem) {
	    return (require("./plugins/" + elem.name + "/files/" + elem.routes));
	}).flatten()));
    },

    /*
    # path -> root of the plugin, files_list -> JSON list of files
    # Go through the directories recursively and
    # return an array of the paths to the files to load
    */
    getFiles: function(path, files_list, plugin) {
	var files = [];
	var file = {};

	for (var i = 0; i < files_list.length; ++i) {
	    file = files_list[i];

	    if (file.type && file.type == "dir" && file.files) {
		var path_dir = path + file.name + '/';
		var sub_dir = Manifest.getFiles(path_dir,  file.files, plugin);

		files = files.concat(sub_dir);
	    }
	    else
		file.name && files.push(path + file.name);
	}

	return (files);
    },

    /*
    # list -> list of plugin objects
    # Fetch available files from the manifest of each and every plugin
    */
    fetchFiles: function(list) {
	var files = [];

	for (var i = 0; i < list.length; ++i) {
	    var plugin = list[i];
	    var path = "./plugins/" + plugin.name + '/';

	    if (plugin.files) {
		var file = require(path + "files/" + plugin.files);

		files.push(Manifest.getFiles(path, file, plugin));
	    }
	}

	return (files.flatten());
    }

}
