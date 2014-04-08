/*
# Copyright (c) 2014 "Capensis" [http://www.capensis.com]
#
# This file is part of Canopsis.
#
# Canopsis is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Canopsis is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
*/
define([
	'jquery',
	'app/lib/ember',
	'app/lib/ember-data',
	'app/application'
], function($, Ember, DS, Application) {

	Application.View = DS.Model.extend({ 
        _id: DS.attr('string'),
        title: DS.attr('string'),
        items : {},
        layout_type : DS.attr('string',{defaultValue: 'vertical'} ),
        layout_cols : DS.attr('number',{ defaultValue:0}),
        layout_rows : DS.attr('number',{ defaultValue:5}),
        viewParameters : { "title": DS.attr('string',{defaultValue:''}),
                           "bar_search" : DS.attr('boolean',{defaultValue:false}),
				           "filter" : {},
				           "column_sort" : DS.attr('boolean',{defaultValue:true}),
				           "xtype" : "list",
				           "pageSize" : DS.attr('number',{defaultValue:100}),
				           "show_source_type" : DS.attr('boolean',{defaultValue:true}),
				           "default_sort_direction" : "DESC",
				           "hideHeaders" : DS.attr('boolean',{defaultValue:false}),
				           "show_last_check" : DS.attr('boolean',{defaultValue:true}),
				           "default_sort_column" : "state",
				           "paging" : DS.attr('boolean',{defaultValue:false}),
				           "show_resource" : DS.attr('boolean',{defaultValue:true}),
				           "show_component" : DS.attr('boolean',{defaultValue:true}),
				           "reload" : DS.attr('boolean',{defaultValue:false}),
				           "show_state" : DS.attr('boolean',{defaultValue:true}),
				           "refreshInterval" : DS.attr('number',{defaultValue:5}),
				           "show_output" : DS.attr('boolean',{defaultValue:true}),
				           "border" : DS.attr('boolean',{defaultValue:true}),
				           "scroll" : DS.attr('boolean',{defaultValue:true}),
				           "show_state_type" : DS.attr('boolean',{defaultValue:true})
			             }
	});

	return Application.View;
});
