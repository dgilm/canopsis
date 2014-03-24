define([
	'canopsis/commit',
	'jquery',
	'app/application',
	'bootstrap',
	'app/lib/helpers',
	'app/lib/templates',
	'app/controller/crecords',
	'app/controller/crecord',
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
	'app/view/application',
	'app/view/accounts'
], function(commit, $, Application) {
	window.Canopsis = Application;
	Canopsis.commit = commit;
});