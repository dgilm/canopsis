define([
	'canopsis/commit',
	'jquery',
	'app/application',
	'text!app/manifest.json',
	'seeds/RoutesLoader',
	'bootstrap',
	'app/lib/helpers',
	'app/lib/templates',
	'app/lib/editors',
	'app/lib/widgets',
	'app/controller/crecords',
	'app/controller/crecordform',
	'app/controller/crecord',
	'app/controller/widget',
    'app/controller/item',
    'app/controller/container',
	'app/controller/login',
	'app/controller/application',
	'app/controller/groups',
	'app/controller/curves',
	'app/controller/perfdatas',
	'app/controller/selectors',
	'app/controller/consolidations',
	'app/controller/accounts',
	'app/controller/userview',
	'app/controller/userviews',
	'app/view/login',
	'app/view/crecordform',
	'app/view/application',
	'app/view/accounts',
	'app/view/editor',
	'app/view/widget'
], function(commit, $, Application, manifest, routesLoader) {
	manifest = JSON.parse(manifest);
	Application.manifest = manifest;

	//TODO auto-require files -->	routesLoader.initializeFiles(JSON.parse(manifest), function());
	routesLoader.initializeRoutes(Application, manifest);

	window.Canopsis = Application;
	Canopsis.commit = commit;
});
