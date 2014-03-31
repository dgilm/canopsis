//TODO implement auto check for mvct file existence and require them automatically

var editorsTemplates = [
	'defaultpropertyeditor',
	'boolean',
	'mail'
];

var deps = ['app/lib/ember', 'app/lib/mmenu'];
var depsSize = deps.length;

for(var i = 0; i < editorsTemplates.length; i++) {
	deps.push('text!editors/' + editorsTemplates[i] + "/" + editorsTemplates[i] + '.html');
}

define(deps, function(Ember) {
	for(var i = depsSize; i < arguments.length; i++) {
		var templateName = "editor-" + editorsTemplates[i - depsSize];
		Ember.TEMPLATES[templateName] = Ember.Handlebars.compile(arguments[i]);
	}
});