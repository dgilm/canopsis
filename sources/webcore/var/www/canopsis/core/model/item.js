define([
	'jquery',
	'app/lib/ember',
	'app/lib/ember-data',
	'app/application'
], function($, Ember, DS, Application) {
	Application.Item = DS.Model.extend({
        _id : DS.attr("string",{ hiddenInForm: true }),
        widget : DS.attr(),
        row : DS.attr("number",{ defaultValue:0 }),
        col : DS.attr("number",{ defaultValue:0 }),
        rowspan : DS.attr("number",{ defaultValue:1 }),
        colspan : DS.attr("number",{ defaultValue:1 }),
        isSelected : DS.attr("boolean", {defaultValue:false }),
        isActivated : DS.attr("boolean", {defaultValue:true })
    });
  return Application.Item ;
 });
