//TODO implement auto check for mvct file existence and require them automatically

var widgetsTemplates = [
	'timegraph'
];

var deps = ['app/lib/ember', 'app/lib/mmenu'];
var depsSize = deps.length;

for(var i = 0; i < widgetsTemplates.length; i++) {
	deps.push('text!widgets/' + widgetsTemplates[i] + '/template.html');
}

define(deps, function(Ember) {
	for(var i = depsSize; i < arguments.length; i++) {
		var templateName = "widget-" + widgetsTemplates[i - depsSize];
		Ember.TEMPLATES[templateName] = Ember.Handlebars.compile(arguments[i]);
	}
});