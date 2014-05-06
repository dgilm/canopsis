require.config({
	baseUrl: '/static/',
	paths: {
		'app': 'canopsis/core',
		'components': 'canopsis/components',
		'schemas': 'canopsis/schemas',
		'etc': 'canopsis/etc',
		'lib': 'webcore-libs/dev',
		'text': 'webcore-libs/dev/text',
		'moment': 'webcore-libs/moment.min',
		'jquery': 'webcore-libs/dev/jquery-1.10.2',
		'plugins': 'webcore-libs/plugins/plugin',
		'consolejs': 'webcore-libs/console.js/console',
		'mmenu': 'webcore-libs/mmenu/js/jquery.mmenu.min.all',
		'colorpicker': 'webcore-libs/colorpicker/js/spectrum',
		'colorselector': 'webcore-libs/colorselector/js/bootstrap-colorselector',
		'seeds': 'webcore-libs/seeds',
		'jsonselect': 'webcore-libs/jsonselect/jsonselect',
		'jquery.encoding.digests.sha1': 'webcore-libs/jQuery.encoding.digests.sha1',
		'jquery.md5': 'webcore-libs/jquery.md5',
		'handlebars': 'webcore-libs/dev/handlebars-1.0.0',
		'ember': 'webcore-libs/dev/ember',
		'gridster': 'webcore-libs/dev/gridster/jquery.gridster',
		'ember-data': 'webcore-libs/dev/ember-data',
		'bootstrap': 'webcore-libs/bootstrap/current/js/bootstrap.min',
	},

	shim: {
		'consolejs': {
			deps: ["ember"]
		},
		'ember': {
			deps: ['jquery', 'handlebars']
		},

		'ember-data': {
			deps: ['ember']
		},

		'bootstrap': {
			deps: ['jquery']
		},

		'colorpicker': {
			deps: ['jquery']
		},

		'gridster': {
			deps: ['jquery']
		}
	}
});

define(["canopsis/file_loader"], function () {
	require(['canopsis/main']);
});
