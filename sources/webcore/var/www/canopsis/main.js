define([
    'canopsis/commit',
    'jquery',
    'seeds/RoutesLoader',
    'app/application',
    'app/controller/application',
    'app/routes/authenticated',
    'app/routes/paginated',
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
