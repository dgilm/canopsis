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


define([
    'canopsis/commit',
    'jquery',
    'seeds/RoutesLoader',
    'app/application',
    'app/adapters/application',
    'app/serializers/application',
    'bootstrap',
    'colorpicker',
    'gridster',
    'components/editors/group/controller',
    'canopsis/core/lib/console'
], function(commit, $, routesLoader, Application) {

    Application.manifest = routes;
    routesLoader.initializeRoutes(Application, routes, function (){

    });

    window.Canopsis = Application;
    Canopsis.commit = commit;

});
