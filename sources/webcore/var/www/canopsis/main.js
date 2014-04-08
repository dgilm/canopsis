define([
	'canopsis/commit',
	'jquery',
	'app/application',
	'text!app/manifest.json',
	'seeds/RoutesLoader',
	'bootstrap',
	'components/editors/group/controller.js',
	'app/controller/accounts',
	'app/controller/application',
	'app/controller/consolidations',
	'app/controller/crecord',
	'app/controller/crecordform',
	'app/controller/crecords',
	'app/controller/curves',
	'app/controller/editor',
	'app/controller/groups',
	'app/controller/login',
	'app/controller/perfdatas',
	'app/controller/selectors',
	'app/controller/userview',
	'app/controller/userviews',
	'app/controller/widget',
	'app/lib/editors',
	'app/lib/helpers',
	'app/lib/renderers',
	'app/lib/templates',
	'app/lib/widgets',
	'app/view/application',
	'app/view/accounts',
	'app/view/groups',
	'app/view/perfdatas',
	'app/view/consolidations',
	'app/view/selectors',
	'app/view/curves',
	'app/view/crecords',
	'app/view/crecordform',
	'app/view/editor',
	'app/view/login',
	'app/view/widget',
	'app/lib/mmenu'
], function(commit, $, Application, manifest, routesLoader) {
	manifest = JSON.parse(manifest);
	Application.manifest = manifest;

	routesLoader.initializeRoutes(Application, manifest);

	window.Canopsis = Application;
	Canopsis.commit = commit;
});