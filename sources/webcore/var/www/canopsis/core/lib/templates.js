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
	'addcrecordform'
];

var deps = ['app/lib/ember', 'app/lib/mmenu'];
var depsSize = deps.length;

for(var i = 0; i < templates.length; i++) {
	deps.push('text!app/templates/' + templates[i] + '.html');
}

define(deps, function(Ember) {
	for(var i = depsSize; i < arguments.length; i++) {
		Ember.TEMPLATES[templates[i - depsSize]] = Ember.Handlebars.compile(arguments[i]);
	}
});