//need:app/lib/view/cform.js,app/lib/form/field/cfieldset.js
/*
# Copyright (c) 2011 "Capensis" [http://www.capensis.com]
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
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with Canopsis.  If not, see <http://www.gnu.org/licenses/>.
*/
Ext.define('canopsis.view.Schedule.Form', {
	extend: 'canopsis.lib.view.cform',

	alias: 'widget.ScheduleForm',

	requires: [
		'canopsis.lib.form.field.cfieldset'
	],

	width:800,
	height:500,

	items: [{
		xtype: 'ccard',
		height:460,
		wizardSteps: [{
			title: _('General options'),
			items: [{
					xtype: 'textfield',
					fieldLabel: _('Schedule name'),
					name: 'crecord_name',
					allowBlank: false
				},{
					xtype: 'combobox',
					fieldLabel: _('Action'),
					name: 'task',
					queryMode: 'local',
					displayField: 'text',
					valueField: 'value',
					value: 'task_reporting.render_pdf',
					disabled: true,
					store: {
						xtype: 'store',
						fields: ['value', 'text'],
						data: [
							{value: 'task_reporting.render_pdf', text: _('Reporting')}
						]
					}
				},{
					xtype: 'combobox',
					fieldLabel: _('View'),
					name: 'exporting_viewName',
					store: 'Views',
					displayField: 'crecord_name',
					valueField: 'id',
					typeAhead: false,
					allowBlank: false,
					minChars: 2,
					queryMode: 'remote',
					emptyText: _('Select a view') + ' ...'
				},{
					xtype: 'combobox',
					fieldLabel: _('Owner'),
					name: 'exporting_owner',
					store: 'Accounts',
					displayField: 'user',
					valueField: 'user',
					typeAhead: false,
					allowBlank: false,
					queryMode: 'remote'
				},{
					xtype: 'cfieldset',
					title: _('Frequency'),
					items: [
						{
							xtype: 'combobox',
							name: 'frequency',
							fieldLabel: _('Every'),
							queryMode: 'local',
							displayField: 'text',
							valueField: 'value',
							value: 'day',
							store: {
								xtype: 'store',
								fields: ['value', 'text'],
								data: [
									{value: 'day', text: _('Day')},
									{value: 'week', text: _('Week')},
									{value: 'month', text: _('Month')},
									{value: 'year', text: _('Year')}
								]
							}
						},{
							xtype: 'combobox',
							name: 'crontab_month',
							fieldLabel: _('Month'),
							queryMode: 'local',
							displayField: 'text',
							valueField: 'value',
							value: _('January'),
							disabled: true,
							store: {
								xtype: 'store',
								fields: ['value', 'text'],
								data: [
									{value: 1, text: _('January')},
									{value: 2, text: _('February')},
									{value: 3, text: _('March')},
									{value: 4, text: _('April')},
									{value: 5, text: _('May')},
									{value: 6, text: _('June')},
									{value: 7, text: _('July')},
									{value: 8, text: _('August')},
									{value: 9, text: _('September')},
									{value: 10, text: _('October')},
									{value: 11, text: _('November')},
									{value: 12, text: _('December')}
								]
							}
						},{
							xtype: 'combobox',
							name: 'crontab_day',
							fieldLabel: _('Day'),
							queryMode: 'local',
							displayField: 'text',
							valueField: 'value',
							value: 1,
							disabled: true,
							hidden: true,
							store: {
								xtype: 'store',
								fields: ['value', 'text'],
								data: (function() {
										var dayData = [];

										for(var i = 1; i < 32; i++) {
											dayData.push({value: i, text: i});
										}

										return dayData;
									})()
							}
						},{
							xtype: 'combobox',
							name: 'crontab_day_of_week',
							fieldLabel: _('Day of week'),
							queryMode: 'local',
							displayField: 'text',
							valueField: 'value',
							value: 'mon',
							disabled: true,
							hidden: true,
							store: {
								xtype: 'store',
								fields: ['value', 'text'],
								data: [
									{value: 'mon', text: _('Monday')},
									{value: 'tue', text: _('Tuesday')},
									{value: 'wed', text: _('Wednesday')},
									{value: 'thu', text: _('Thursday')},
									{value: 'fri', text: _('Friday')},
									{value: 'sat', text: _('Satursday')},
									{value: 'sun', text: _('Sunday')}
								]
							}
						},{
							xtype: 'textfield',
							name: 'crontab_hours',
							fieldLabel: _('Hours (local time)'),
							allowBlank: false,
							regex: getTimeRegex()
						}
					]
				},{
					xtype: 'cfieldset',
					title: _('Exporting Interval'),
					checkboxName: 'exporting_interval',
					items: [
						{
							xtype: 'numberfield',
							name: 'exporting_intervalUnit',
							fieldLabel: _('The last'),
							minValue: 1,
							value: 1,
						},{
							xtype: 'combobox',
							name: 'exporting_intervalLength',
							queryMode: 'local',
							displayField: 'text',
							valueField: 'value',
							value: global.commonTs.day,
							store: {
								xtype: 'store',
								fields: ['value', 'text'],
								data: [
									{value: global.commonTs.day, text: _('Day')},
									{value: global.commonTs.week, text: _('Week')},
									{value: global.commonTs.month, text: _('Month')},
									{value: global.commonTs.year, text: _('Year')}
								]
							}
						}
					]
				},{
					xtype: 'cfieldset',
					checkboxName: 'exporting_mail',
					title: _('Mailing Options'),
					items: [
						{
							xtype: 'textfield',
							fieldLabel: _('mailTo'),
							name: 'exporting_recipients'
						},{
							xtype: 'textfield',
							fieldLabel: _('Subject'),
							name: 'exporting_subject'
						}
					]
				}
			]
		},{
			title:"Hostgroups",
			items: [{
				xtype:"cgrid",
				itemId:"scheduleHostgroupsGrid",
				store: {
					xtype: "store",
					fields: ["hostgroup"],
					reader: {
						type: 'json'
					}
				},
				columns:[{
					header: "Hostgroup",
					sortable: false,
					dataIndex: "hostgroup",
					editor: "field",
					// renderer: rdr_tstodate,
					flex: 3
				}],
				opt_bar_reload: false,
				queryMode: 'local',
				opt_keynav_del : true,
				opt_menu_delete: true,
				opt_bar_delete : true,
				opt_bar_enable: false,
				opt_confirmation_delete: false
			}],
		},{
			title: _('Exclusion intervals'),
			items:[{
					xtype:"cgrid",
					itemId:"scheduleExclusionIntervalGrid",
					store: {
						xtype: "store",
						fields: ["from", "to"],
						reader: {
							type: 'json'
						}
					},
					columns:[{
						header: "from",
						sortable: false,
						dataIndex: "from",
						editor: "field",
						renderer: rdr_tstodate,
						flex: 3
					},{
						header: "to",
						sortable: false,
						dataIndex: "to",
						editor: "field",
						renderer: rdr_tstodate,
						flex: 3
					}],
					height:100,
					opt_bar_reload: false,
			        queryMode: 'local',
			        opt_keynav_del : true,
					opt_menu_delete: true,
			        opt_bar_delete : true,
					opt_bar_enable: false,
					opt_confirmation_delete: false
				}]
		},{
			title:"Downtimes",
			items: [{
				xtype:"cinventory",
				itemId : "scheduleDowntimes",
				reload_button:false,
				multiSelect: true,
				inventory_url: '/rest/downtime',
				vertical_multiselect: false
			}],
		}]
	}],

	initComponent: function() {
		//IE hack
		if(Ext.isIE) {
			this.height = 500;
			this.width = 300;
		}

		this.callParent(arguments);

		var durationCombo = this.down('*[name="frequency"]');
		dayCombo = this.down('*[name="crontab_day"]');
		dayWeekCombo = this.down('*[name="crontab_day_of_week"]');
		monthCombo = this.down('*[name="crontab_month"]');

		durationCombo.on('change', function(combo, value) {
			void(combo);

			switch (value) {
				case 'day':
					dayCombo.hide().setDisabled(true);
					dayWeekCombo.hide().setDisabled(true);
					monthCombo.setDisabled(true);
					break;

				case 'week':
					dayCombo.hide().setDisabled(true);
					dayWeekCombo.show().setDisabled(false);
					monthCombo.setDisabled(true);
					break;

				case 'month':
					dayCombo.show().setDisabled(false);
					dayWeekCombo.hide().setDisabled(true);
					monthCombo.setDisabled(true);
					break;

				case 'year':
					dayCombo.show().setDisabled(false);
					dayWeekCombo.hide().setDisabled(true);
					monthCombo.setDisabled(false);
					break;

				default:
					log.debug('Wrong value');
					break;
			}
		}, this);

		this.down('*[name="exporting_owner"]').setValue(global.account.user);

		this.initializePopups();
	},

	initializePopups: function() {
		this.addExclusionIntervalWindow = Ext.create('Ext.window.Window', {
			closeAction:'hide',
			cls: 'scheduleAddExclusionIntervalWindow',
			modal:true,
			items:[{
				xtype: "panel",
				items:[{
					xtype: "cdate",
					itemId: "newExclusionInterval_from",
					label_text: "From"
				},{
					xtype: "cdate",
					itemId: "newExclusionInterval_to",
					label_text: "To"
				},{
					xtype: "button",
					text: "Save",
					action: "addExclusionInterval"
				}]
			}]
		});

		this.addComponentResourceWindow = Ext.create('Ext.window.Window', {
			closeAction:'hide',
			cls: 'scheduleAddComponentResourceWindow',
			modal:true,
			items:[{
				xtype: "panel",
				items:[{
					xtype: "textfield",
					itemId: "component",
					fieldLabel: "Component"
				},{
					xtype: "textfield",
					itemId: "resource",
					fieldLabel: "Resource"
				},{
					xtype: "button",
					text: "Save",
					action: "addComponentResource"
				}]
			}]
		});

		this.addHostgroupWindow = Ext.create('Ext.window.Window', {
			closeAction:'hide',
			cls: 'scheduleAddHostgroupWindow',
			modal:true,
			items:[{
				xtype: "panel",
				items:[{
					xtype: "textfield",
					itemId: "hostgroup",
					fieldLabel: "Hostgroup"
				},{
					xtype: "button",
					text: "Save",
					action: "addHostgroup"
				}]
			}]
		});

		this.down('cgrid#scheduleHostgroupsGrid button[action="add"]').handler = this.showAddHostgroupWindow.bind(this);
		this.down('cgrid#scheduleExclusionIntervalGrid button[action="add"]').handler = this.showAddExclusionIntervalWindow.bind(this);

		this.addExclusionIntervalWindow.down('button[action="addExclusionInterval"]').handler = this.addExclusionInterval2.bind(this);
		this.addHostgroupWindow.down('button[action="addHostgroup"]').handler = this.addHostgroup2.bind(this);
	},

	showAddExclusionIntervalWindow: function() {
		log.debug("showAddExclusionIntervalWindow");
		this.addExclusionIntervalWindow.show();
	},

	showAddHostgroupWindow: function() {
		log.debug("showAddHostgroupWindow");
		this.addHostgroupWindow.show();
	},

	addExclusionInterval2: function() {
		log.debug("new exclusion interval");
		var from = this.addExclusionIntervalWindow.down("#newExclusionInterval_from").getValue();
		var to = this.addExclusionIntervalWindow.down("#newExclusionInterval_to").getValue();

		this.addExclusionIntervalWindow.hide();

		var grid = this.down("#scheduleExclusionIntervalGrid");
		grid.store.add({from: from, to: to});
	},

	addHostgroup2: function() {
		log.debug("new hostgroup");
		var hostgroup = this.addHostgroupWindow.down("#hostgroup").getValue();

		this.addHostgroupWindow.hide();

		var grid = this.down("#scheduleHostgroupsGrid");
		grid.store.add({hostgroup: hostgroup});
	}
});
