var routes;

require([
    'plugins',
    'text!canopsis/enabled.json',
    'text!canopsis/core/files/manifest.json',
    'text!canopsis/core/files/routes.json',
    'text!canopsis/core/files/files.json'
], function() {
    var plugins = [];
    var path = "canopsis/";
    var files;

    try {
	plugins = Plugins.getPlugins(path);
	plugins = Plugins.resolveDependancies(plugins);
    } catch (e) {
	console.log("PluginError: " + e);
    }

    routes = Manifest.fetchRoutes(plugins, path);
    files = Manifest.fetchFiles(plugins, path);
    files = files.map(function(e, i, a) { return (e.replace("canopsis/core/", "app/")); });
    require(files);
});

