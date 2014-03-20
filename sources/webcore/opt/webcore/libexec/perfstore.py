
#!/usr/bin/env python
# --------------------------------
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
# ---------------------------------

import sys, os, logging, json, time
from datetime import datetime

import bottle
from bottle import route, get, post, put, delete, request, HTTPError, response

#import protection function
from libexec.auth import get_account

# Modules
from cstorage import get_storage

from ctools import parse_perfdata, clean_mfilter
from ctools import cleanTimestamp
from ctools import internal_metrics

import pyperfstore2
import pyperfstore2.utils
import pyperfstore2.forecastingMethods

manager = None

logger = logging.getLogger("perfstore")

def load():
	global manager
	manager = pyperfstore2.manager(logging_level=logging.INFO)

def unload():
	global manager
	del manager

group_managing_access = ['group.CPS_perfdata_admin']
#########################################################################

#### POST@
@post('/perfstore/values')
@post('/perfstore/values/:start/:stop')
def perfstore_values_route(start = None, stop = None):
	"""subset selection param allow filter metrics with exclusion periods and component,resource,hostgroup exclusion"""
	return perfstore_nodes_get_values( 	start = start,
										stop = stop,
										metas = request.params.get('nodes', default=None),
										aggregate_method = request.params.get('aggregate_method', default=None),
										aggregate_interval = request.params.get('aggregate_interval', default=None),
										aggregate_max_points = request.params.get('aggregate_max_points', default=None),
										aggregate_round_time = request.params.get('aggregate_round_time', default=None),
										consolidation_method = request.params.get('consolidation_method', default=None),
										forecast_checked = request.params.get('forecast_checked', default=None),
										forecast_alertTreshold = request.params.get('forecast_alertTreshold', default=None),
										forecast_alertMax = request.params.get('forecast_alertMax', default=None),
										forecast_seasonality = request.params.get('forecast_seasonality', default=None),
										forecast_method = request.params.get('forecast_method', default=None),
										forecast_alpha = request.params.get('forecast_alpha', default=None),
										forecast_beta = request.params.get('forecast_beta', default=None),
										forecast_gamma = request.params.get('forecast_gamma', default=None),
										timezone = request.params.get('timezone', default=None),
										subset_selection = request.params.get('subset_selection', default={}))


@get('/perfstore')
@get('/perfstore/get_all_metrics')
def perfstore_get_all_metrics():
	return perfstore_get_all_metrics(	limit = int(request.params.get('limit', default=20)),
										start = int(request.params.get('start', default=0)),
										search = request.params.get('search', default=None),
										filter = request.params.get('filter', default=None),
										sort = request.params.get('sort', default=None),
										show_internals = request.params.get('show_internals', default=False))


def perfstore_nodes_get_values( start = None,
								stop = None,
								metas = None,
								aggregate_method = None,
								aggregate_interval = None,
								aggregate_max_points = None,
								aggregate_round_time = None,
								consolidation_method = None,
								forecast_checked = None,
								forecast_alertTreshold =None,
								forecast_alertMax = None,
								forecast_seasonality =None,
								forecast_method = None,
								forecast_alpha = None,
								forecast_beta = None,
								forecast_gamma = None,
								timezone = 0,
								subset_selection = {}):

	if subset_selection:
		try:
			subset_selection = json.loads(subset_selection)
			logger.debug('subset selection found : ' + str(subset_selection))
		except:
			subset_selection = {}
			logger.warning('Unable to load subset_selection filters from params')

	if manager == None:
		load()

	interval = None

	output = []
	
	if not metas:
		logger.warning("Invalid arguments")
		return HTTPError(404, "Invalid arguments")

	metas = json.loads(metas)
	
	logger.debug("POST:")
	logger.debug(" + metas: %s" % metas)	
	logger.debug(" + aggregate_method: %s" % aggregate_method)
	logger.debug(" + aggregate_interval: %s" % aggregate_interval)
	logger.debug(" + aggregate_max_points: %s" % aggregate_max_points)
	logger.debug(" + aggregate_round_time: %s" % aggregate_round_time)
	logger.debug(" + consolidation_method: %s" % consolidation_method)
	logger.debug(" + forecast_checked: %s" % forecast_checked)
	logger.debug(" + forecast_alertTreshold: %s" % forecast_alertTreshold)
	logger.debug(" + forecast_alertMax: %s" % forecast_alertMax)
	logger.debug(" + forecast_seasonality: %s" % forecast_seasonality)
	logger.debug(" + forecast_method: %s" % forecast_method)
	logger.debug(" + forecast_alpha: %s" % forecast_alpha)
	logger.debug(" + forecast_beta: %s" % forecast_beta)
	logger.debug(" + forecast_gamma: %s" % forecast_gamma)
	logger.debug(" + timezone: %s" % timezone)

	forecast_alertTreshold = int(forecast_alertTreshold)
	forecast_seasonality = int(forecast_seasonality)
	forecast_alpha = float(forecast_alpha)
	forecast_beta = float(forecast_beta)
	forecast_gamma = float(forecast_gamma)
	forecast_alertMax = float(forecast_alertMax)

	output = []

	for meta in metas:
		_id = meta.get('id', None)

		# TODO: for futur version, use only this !
		mstart = meta.get('from', start)
		mstop = meta.get('to', stop)
		if _id:
			output += perfstore_get_values(	_id=meta['id'],
											start=mstart,
											stop=mstop,
											aggregate_method=aggregate_method,
											aggregate_interval=aggregate_interval,
											aggregate_max_points=aggregate_max_points,
											aggregate_round_time=aggregate_round_time,
											timezone=time.timezone,
											subset_selection=subset_selection)

	if aggregate_method and consolidation_method and len(output):
		# select right function
		if consolidation_method == 'mean':
			fn = pyperfstore2.utils.mean
		elif consolidation_method == 'min':
			fn = min
		elif consolidation_method == 'max' :
			fn = max
		elif consolidation_method == 'sum':
			fn = sum
		elif consolidation_method == 'delta':
			fn = lambda x: x[0] - x[-1]

		mMax = 0
		# calculate methods
		values = dict()
		for serie in output:

			if serie['ma']!=None and mMax < serie['ma'] :
				mMax = serie['ma']

			for point in serie['values']:
				if not point[0] in values:
					values[point[0]] = []
				if point[1] is not None:
					values[point[0]].append(point[1])

		points = []
		for timestamp, value in values.iteritems():
			point = [timestamp, fn(value) if value else None]
			points.append(point)

		points = sorted(points, key=lambda point: point[0])

		output = [{
			'node': output[0]['node'],
			'metric': consolidation_method,
			'bunit': None,
			'type': 'GAUGE',
			'values': points
		}]

		if forecast_checked == "yes" :
			forecastSerie = perfstore_get_forecast_values( points,forecast_seasonality, 
														   forecast_method, forecast_alpha, 
														   forecast_beta, forecast_gamma )

			output.append( { 'node': output[0]['node']+'_forecast',
							 'metric': consolidation_method,
							 'bunit': None,
							 'type': 'GAUGE',
							 'values' : forecastSerie
								 } )

			if mMax==0 and forecast_alertMax!=0 :
				mMax = forecast_alertMax

			if forecast_alertTreshold!=None and mMax!=0 :
				output.append( { 'node': output[0]['node']+'_alert_treshold',
								'metric' : 'Alert threshold ( ' + consolidation_method + ' )',
								'bunit': None,
								'type': 'GAUGE',
								'values' : [ [ pt[0],float(mMax*forecast_alertTreshold)/100.0] for pt in forecastSerie ] } )


	if aggregate_method and forecast_checked=="yes" and consolidation_method==None and len(output):
		output_AggreggateAndForecastSeries = list()
		logger.debug("output before forecast : %s " % output )

		for serie in output:
			output_AggreggateAndForecastSeries.append( serie )					

			if forecast_alertTreshold!=None and serie['max']!=None :
				maxSerie = forecast_alertTreshold*serie['max']/100.0

			elif forecast_alertTreshold!=None and serie['max']==None and forecast_alertMax!=0 :
				maxSerie = forecast_alertTreshold*forecast_alertMax/100.0
			else:
				maxSerie = 0

			#Forecast processus
			forecastSerie = perfstore_get_forecast_values( serie['values'],forecast_seasonality, 
														   forecast_method, forecast_alpha, 
														   forecast_beta, forecast_gamma )
			# forecasting serie 
			serie_forecast = dict( serie )
			serie_forecast['node'] = serie_forecast['node']+'_forecast'
			serie_forecast['values'] = forecastSerie

			output_AggreggateAndForecastSeries.append( serie_forecast)

			# Treshold serie
			serie_threshold = dict( serie )
			serie_threshold['node'] = serie_threshold['node']+'_alert_treshold'
			serie_threshold['metric'] = 'Alert threshold ( ' + serie_threshold['metric'] + ' )'
			serie_threshold['values']=[ [ pt[0],maxSerie] for pt in forecastSerie ]

			logger.debug( 'serie_threshold : %s' % serie_threshold )

			output_AggreggateAndForecastSeries.append(serie_threshold)


		output = output_AggreggateAndForecastSeries


	output = {'total': len(output), 'success': True, 'data': output}

	logger.debug( '' )
	logger.debug( '#####################################' )
	logger.debug( 'output : %s' % output)
	logger.debug( '#####################################' )

	return output


def perfstore_get_all_metrics(limit = 20, start = 0, search = None, filter = None, sort = None, show_internals = False):
	logger.debug("perfstore_get_all_metrics:")
	
	if manager == None:
		load()
	
	if filter:
		try:
			filter = json.loads(filter)
		except Exception, err:
			logger.error("Impossible to decode filter: %s: %s" % (filter, err))
			filter = None
	
	
	if show_internals == "true":
		show_internals = True
	else:
		show_internals = False
		
	msort = []
	if sort:
		sort = json.loads(sort)
		for item in sort:
			direction = 1
			if str(item['direction']) == "DESC":
				direction = -1
			msort.append((str(item['property']), direction))
	else:
		msort.append(('co', 1))
	
	logger.debug(" + limit:   %s" % limit)
	logger.debug(" + start:   %s" % start)
	logger.debug(" + search:  %s" % search)
	logger.debug(" + sort: "+str(sort))
	logger.debug(" + msort: "+str(msort))
	logger.debug(" + filter:  %s" % filter)
	logger.debug(" + show_internals:  %s" % show_internals)
	
	mfilter = None
	
	if isinstance(filter, list):
		if len(filter) > 0:
			mfilter = filter[0]
		else:
			logger.error(" + Invalid filter format")
			
	elif isinstance(filter, dict):
		mfilter = filter
	
	if search:
		# Todo: Tweak this ...
		fields = ['co', 're', 'me']
		mor = []
		search = search.split(' ')
		if len(search) == 1:
			for field in fields:
				mor.append({field: {'$regex': '.*%s.*' % search[0], '$options': 'i'}})
				
			mfilter = {'$or': mor}
		else:
			mfilter = {'$and': []}
			for word in search:
				mor = []
				for field in fields:
					mor.append({field: {'$regex': '.*%s.*' % word, '$options': 'i'}})	
				mfilter['$and'].append({'$or': mor})
	
	if not show_internals:
		if mfilter:
			mfilter = {'$and': [mfilter, {'me': {'$nin':internal_metrics  }}]}
		else:
			mfilter = {'me': {'$nin': internal_metrics  }}
		
	logger.debug(" + mfilter:  %s" % mfilter)
	
	mfilter = clean_mfilter(mfilter)

	data  = manager.find(limit=limit, skip=start, mfilter=mfilter, data=False, sort=msort)
	total = data.count()
	data  = list(data)
	
	return {'success': True, 'data' : data, 'total' : total}


### manipulating meta
@delete('/perfstore',checkAuthPlugin={'authorized_grp':group_managing_access})
@delete('/perfstore/:_id',checkAuthPlugin={'authorized_grp':group_managing_access})
def remove_meta(_id=None):
	if not _id:
		_id =  json.loads(request.body.readline())
	if not _id:
		return HTTPError(400, "No ids provided, bad request")
		
	if not isinstance(_id,list):
		_id = [_id]
	
	logger.debug('delete %s: ' % str(_id))
	
	for item in _id:
		if isinstance(item,dict):
			manager.remove(_id=item['_id'], purge=False)
		else:
			manager.remove(_id=item, purge=False)
			
@put('/perfstore',checkAuthPlugin={'authorized_grp':group_managing_access})
def update_meta(_id=None):
	data = json.loads(request.body.readline())
	
	if not isinstance(data,list):
		data = [data]
	
	for item in data:
		try:
			if not _id:
				_id = item['_id']
			if '_id' in item:
				del item['_id']
			manager.store.update(_id=_id, mset=item)
		except Exception, err:
			logger.warning('Error while updating meta_id: %s' % err)
			return HTTPError(500, "Error while updating meta_id: %s" % err)

#### POST@
@route('/perfstore/perftop')
@route('/perfstore/perftop/:start/:stop')
def perfstore_perftop(start=None, stop=None):
	data = []
	
	limit					= int(request.params.get('limit', default=10))
	sort					= int(request.params.get('sort', default=1))
	mfilter					= request.params.get('mfilter', default={})
	get_output				= request.params.get('output', default=False)
	time_window				= int(request.params.get('time_window', default=86400))
	threshold				= request.params.get('threshold', default=None)
	threshold_direction 	= int(request.params.get('threshold_direction', default=-1))
	expand 					= request.params.get('expand', default=False)
	percent					= request.params.get('percent', default=False)
	threshold_on_pct		= request.params.get('threshold_on_pct', default=False)
	report					= request.params.get('report', default=False)

	export_csv				= request.params.get('csv', default=False)
	export_fields			= request.params.get('fields', default="[]")

	if percent == 'true':
		percent = True
	elif percent == 'false':
		percent = False

	if report == 'true':
		report = True
	elif report == 'false':
		report = False

	if threshold_on_pct == 'true':
		threshold_on_pct = True
	elif threshold_on_pct == 'false':
		threshold_on_pct = False
	
	sort_on_percent = False
	if percent == True:
		sort_on_percent = True

	if mfilter:
		try:
			mfilter = json.loads(mfilter)
		except Exception, err:
			logger.error("Impossible to decode mfilter: %s: %s" % (mfilter, err))
			mfilter = None

	try:
		export_fields = json.loads(export_fields)

	except ValueError, err:
		logger.error("Impossible to decode export_fields: %s: %s" % (export_fields, err))
		export_fields = []


	if threshold:
		threshold = float(threshold)

	if expand == 'true':
		expand = True
	else:
		expand = False

	if stop:
		stop = int(stop)
	else:
		stop = int(time.time())
		
	if start:
		start = int(start)
	else:
		start = stop - time_window

	logger.debug("PerfTop:")
	logger.debug(" + mfilter:     %s" % mfilter)
	logger.debug(" + get_output:  %s" % get_output)
	logger.debug(" + limit:       %s" % limit)
	logger.debug(" + threshold:   %s" % threshold)
	logger.debug(" + threshold_direction:   %s" % threshold_direction)
	logger.debug(" + sort:        %s" % sort)
	logger.debug(" + expand:       %s" % expand)
	logger.debug(" + report:       %s" % report)
	logger.debug(" + percent:       %s" % percent)
	logger.debug(" + threshold_on_pct:       %s" % threshold_on_pct)
	logger.debug(" + time_window: %s" % time_window)
	logger.debug(" + start:       %s (%s)" % (start, datetime.utcfromtimestamp(start)))
	logger.debug(" + stop:        %s (%s)" % (stop, datetime.utcfromtimestamp(stop)))
	logger.debug(" + export csv:  %s" % export_csv)
	logger.debug(" + export fields: %s" % str(export_fields))

	mfilter =  clean_mfilter(mfilter)
	
	mtype = manager.store.find(mfilter=mfilter, limit=1, mfields=['t'])
	
	def check_threshold(value):
		if threshold:
			if threshold_direction == -1 and value >= threshold:
				return True
			elif threshold_direction == 1 and value <= threshold:
				return True
			else:
				return False
		else:
			return True

	if mtype:
		mtype = mtype.get('t', 'GAUGE')

		logger.debug(" + mtype:    %s" % mtype)
		
		if mtype != 'COUNTER' and not expand and not report:
			# Quick method, use last value
			metrics = manager.store.find(mfilter=mfilter, mfields=['_id', 'co', 're', 'me', 'lv', 'u', 'ma', 'lts'], sort=[('lv', sort)], limit=limit)
			
			if isinstance(metrics, dict):
				metrics = [metrics]

			for metric in metrics:
				if (percent or threshold_on_pct) and 'ma' in metric and 'lv' in metric:
					metric['pct'] = round(((metric['lv'] * 100)/ metric['ma']) * 100) / 100
				
				if threshold_on_pct:
					val = metric['pct']
				else:
					val = metric['lv']

				if check_threshold(val):
					data.append(metric)
		else:
			# Compute values
			metric_limit = 0
			
			if expand:
				metric_limit = 1

			#clean mfilter
			mfilter =  clean_mfilter(mfilter)

			metrics =  manager.store.find(mfilter=mfilter, mfields=['_id', 'co', 're', 'me', 'lv', 'u', 'ma', 'lts', 't'], limit=metric_limit)

			if isinstance(metrics, dict):
				metrics = [metrics]

			for metric in metrics:
				# Recheck type
				mtype = metric.get('t', 'GAUGE')
				if mtype != 'COUNTER' and not expand and not report:
					logger.debug(" + Metric '%s' (%s) is not a COUNTER" % (metric['me'], metric['_id']))

					if (percent or threshold_on_pct) and 'ma' in metric and 'lv' in metric:
							metric['pct'] = round(((metric['lv'] * 100)/ metric['ma']) * 100) / 100

					if threshold_on_pct:
						val = metric['pct']
					else:
						val = metric['lv']

					if check_threshold(val):
						data.append(metric)
				else:
					points = []
					if mtype != 'COUNTER' and not expand:
						# Get only one point
						point = manager.get_point(_id=metric['_id'], ts=stop)
						if point:
							points = [point]
					else:
						# grt points from 'start' to 'stop'
						points = manager.get_points(_id=metric['_id'], tstart=start, tstop=stop)

					if len(points):
						if expand:
							del metric['_id']	
							for point in points:
								if check_threshold(point[1]):
									nmetric = metric.copy()
									nmetric['lts'] = point[0]
									nmetric['lv'] = point[1]
									if (percent or threshold_on_pct) and 'ma' in nmetric and 'lv' in nmetric:
										nmetric['pct'] = round(((nmetric['lv'] * 100)/ nmetric['ma']) * 100) / 100
									data.append(nmetric)
						else:		
							# keep last point
							metric['lts'] = points[len(points)-1][0]
							metric['lv'] = points[len(points)-1][1]

							if (percent or threshold_on_pct) and 'ma' in metric and 'lv' in metric:
									metric['pct'] = round(((metric['lv'] * 100)/ metric['ma']) * 100) / 100

							if threshold_on_pct:
								val = metric['pct']
							else:
								val = metric['lv']

							if check_threshold(val):
								data.append(metric)

		# Calculate most recurrent output
		if get_output:
			logs = get_storage(namespace='events_log', account=get_account())

			for item in data:
				evfilter = {'$and': [
					{
						'component': item['co'],
						'resource': item.get('re', {'$exists': False}),
						'state': {'$ne': 0}
					},{
						'timestamp': {'$gt': start}
					},{
						'timestamp': {'$lt': stop}
					}
				]}

				records = logs.find(evfilter)

				outputs = {}

				for record in records:
					output = record.data['output']

					if output not in outputs:
						outputs[output] = 1

					else:
						outputs[output] += 1

				last_max = 0

				for output in outputs:
					if outputs[output] > last_max:
						item['output'] = output
						last_max = outputs[output]

		reverse = True
		if sort == 1:
			reverse = False	

		if sort_on_percent:
			for item in data:
				if not 'pct' in item:
					item['pct'] = -1
			data = sorted(data, key=lambda k: k['pct'] , reverse=reverse)[:limit]
		else:
			data = sorted(data, key=lambda k: k['lv'], reverse=reverse)[:limit]
	else:
		logger.debug("No records found")
	
	if not export_csv:
		return {'success': True, 'data' : data, 'total' : len(data)}

	else:
		response.headers['Content-Disposition'] = 'attachment; filename="perftop.csv"'
		response.headers['Content-Type'] = 'text/csv'

		exported = None

		logger.debug(' + Data: %s' % str(data))

		for entry in data:
			row = []

			for field in export_fields:
				value = entry.get(field, '')

				if isinstance(value, basestring):
					value = value.replace('"', '""')
					value = u'"{0}"'.format(value)

				else:
					value = str(value)

				row.append(value)

			if exported:
				exported = u"{0}\n{1}".format(exported, u','.join(row))

			else:
				exported = u','.join(row)

		logger.debug(' + Exported: %s' % exported)

		return exported

########################################################################
# Functions
########################################################################

def perfstore_get_values(_id, start=None, stop=None, aggregate_method=None, aggregate_interval=None, aggregate_max_points=None, aggregate_round_time=True, timezone=0, subset_selection={}):
	
	if start and not stop:
		stop = start
	
	if stop:
		stop = int(stop)
	else:
		stop = int(time.time())
		
	if start:
		start = int(start)
	else:
		start = stop - 86400

	if aggregate_interval:
		aggregate_interval = int(aggregate_interval)
	
	logger.debug("Perfstore get points:")
	logger.debug(" + meta _id:    %s" % _id)
	logger.debug(" + start:       %s (%s)" % (start, datetime.utcfromtimestamp(start)))
	logger.debug(" + stop:        %s (%s)" % (stop, datetime.utcfromtimestamp(stop)))
	logger.debug('Aggregate:')
	logger.debug(' + method :     %s' % aggregate_method)
	logger.debug(' + interval :   %s' % aggregate_interval)
	logger.debug(' + round time : %s' % aggregate_round_time)
	logger.debug(' + max_points : %s' % aggregate_max_points)
	
	output=[]
	meta = None
	
	if not _id:
		logger.error("Invalid _id '%s'" % _id)
		return output
	
	fill = False

	if aggregate_interval:
		aggregate_max_points = int( round((stop - start) / aggregate_interval + 0.5) )
		fill = True

	try:
		points = []
		if start == stop:
			# Get only one point
			logger.debug("   + Get one point at %s: %s" % (stop, datetime.utcfromtimestamp(start)))
			(meta, point) = manager.get_point(	_id=_id,
												ts=start,
												return_meta=True,
												subset_selection=subset_selection)
			if point:
				points = [ point ]
				# Computes exclusion on metric point(s)
				points = exclude_points(points, subset_selection)

			logger.debug('Point: %s' % points)

		else:
			(meta, points) = manager.get_points(	_id=_id,
													tstart=start,
													tstop=stop,
													return_meta=True,
													subset_selection=subset_selection)
			# Computes exclusion on metric point(s)
			points = exclude_points(points, subset_selection)

			# For UI display
			if len(points) == 0 and meta['type'] == 'COUNTER':
				points = [(start, 0), (stop, 0)]

			if len(points) and meta['type'] == 'COUNTER':
				# Insert null point for aggreagation
				points.insert(0, [points[0][0], 0])

			if len(points) and aggregate_method:
				points =  pyperfstore2.utils.aggregate(	points=points,
														max_points=aggregate_max_points,
														interval=aggregate_interval,
														atype=aggregate_method,
														start=start,
														stop=stop,
														fill=fill,
														roundtime = aggregate_round_time,
														timezone=timezone)

	except Exception, err:
		logger.error("Error when getting points: %s" % err)

	if points and meta:
		output.append({'node': _id, 'metric': meta['me'], 'values': points, 'bunit': meta['unit'], 'min': meta['min'], 'max': meta['max'], 'thld_warn': meta['thd_warn'], 'thld_crit': meta['thd_crit'], 'type': meta['type']})

	return output

###############################################################################
#
###############################################################################
def perfstore_get_forecast_values( points, forecast_seasonality, forecast_method, 
								   forecast_alpha, forecast_beta, forecast_gamma ):

	forecastSerie = []

	try:
		
		if len(points) :
			# points validation
			serieValidity = pyperfstore2.forecastingMethods.validateSerie(points)

			if serieValidity['validity'] == 'all' :
			   validBackground = points

			elif serieValidity['validity'] == 'by period' :
				validBackground = points[ serieValidity['lastIndice']+1: ]
			
			forecastDuration = int( len(validBackground)*0.5 )

			if forecastDuration == 0 :
				logger.debug(" Not enough data to make a forecast ")
				logger.debug(" we just make a smoothing ")
						
			
			forecastingParameters = {}

			if forecast_method == "" :
				forecast_method = None

			if forecast_seasonality == 0 : 
						forecast_seasonality = None


			if forecast_method!=None :

				if forecast_method == "h_linear" and forecast_alpha!=0 and forecast_beta!=0:
					forecastingParameters['method'] = forecast_method
					forecastingParameters['alpha'] = forecast_alpha
					forecastingParameters['beta'] = forecast_beta

				elif( forecast_method!="h_linear" and forecast_seasonality!=None and 
				      forecast_alpha!=0 and forecast_beta!=0 and forecast_gamma!=0 ):

					forecastingParameters['method'] = forecast_method
					forecastingParameters['alpha'] = forecast_alpha
					forecastingParameters['beta'] = forecast_beta
					forecastingParameters['seasonality'] = forecast_seasonality
					forecastingParameters['gamma'] = forecast_gamma

				else :

					forecastingParameters = pyperfstore2.forecastingMethods.optimiseHoltWintersAlgorithm( validBackground,
						                                                                                  forecast_seasonality,
																									      forecast_method )



			else :
				forecastingParameters = pyperfstore2.forecastingMethods.optimiseHoltWintersAlgorithm( validBackground,
						                                                                              forecast_seasonality,
																									  forecast_method )

			logger.debug("Forecast parameters :")
			logger.debug("Duration : %s " % forecastDuration )
			logger.debug(" Method : %s" % forecastingParameters['method'])

			if forecastingParameters['method'] == 'h_linear' :  

				logger.debug("Coeff alpha, beta : %s, %s" %( forecastingParameters['alpha'],forecastingParameters['beta']))

				indiceOutliers = { 'trendChange':0, 'outliers':[] }

				while indiceOutliers['trendChange']!=-1 :
					forecastSmoothing = pyperfstore2.forecastingMethods.calculateHoltWintersLinearMethod(  
																						validBackground, 
																						0,
																						forecastingParameters['alpha'],
																						forecastingParameters['beta'] )

					indiceOutliers = pyperfstore2.forecastingMethods.detectOutliersOrTrendChanges( validBackground,
						                                                                           forecastSmoothing,
						 																		    0.15)
					
					logger.debug( 'indiceOutliers : %s' % indiceOutliers)
					tc = indiceOutliers['trendChange']	
					                                                
					if tc !=-1 :
						validBackground = validBackground[ (tc-1) : ]


					logger.debug( "indiceOutliers : %s" %  indiceOutliers )


				forecastingParameters = pyperfstore2.forecastingMethods.optimiseHoltWintersAlgorithm( validBackground,
						                                                                              forecast_seasonality,
																									  forecast_method )

				forecastDuration = int( len(validBackground)*0.5 )

				if forecastDuration == 0 :
					logger.debug(" Not enough data to make a forecast ")
					logger.debug(" we just make a smoothing ")

				forecastSerie = pyperfstore2.forecastingMethods.calculateHoltWintersLinearMethod(  
																						validBackground, 
																						forecastDuration,
																						forecastingParameters['alpha'],
																						forecastingParameters['beta'] )


			elif forecastingParameters['method'] == 'hw_additive' :
				logger.debug("Coeff alpha, beta,gamma : %s, %s, %s" %( forecastingParameters['alpha'],
																	   forecastingParameters['beta'],
																	   forecastingParameters['gamma']) )

				logger.debug("Calculated seasonality : %s" % forecastingParameters['seasonality'])
				forecastSerie = pyperfstore2.forecastingMethods.calculateHoltWintersAdditiveSeasonalMethod( 
																					validBackground, 
																					forecastDuration,
																					forecastingParameters['seasonality'],
																					forecastingParameters['alpha'],
																					forecastingParameters['beta'],
																					forecastingParameters['gamma'] )

			elif forecastingParameters['method'] == 'hw_multiplicative' :				
				logger.debug("Coeff alpha, beta,gamma : %s, %s, %s" %( forecastingParameters['alpha'],
																	   forecastingParameters['beta'],
																	   forecastingParameters['gamma']) )
				
				logger.debug("Calculated seasonality : %s" % forecastingParameters['seasonality'])
				forecastSerie = pyperfstore2.forecastingMethods.calculateHoltWintersMultiplicativeSeasonalMethod(
																					validBackground, 
																					forecastDuration,
																					forecastingParameters['seasonality'],
																					forecastingParameters['alpha'],
																					forecastingParameters['beta'],
																					forecastingParameters['gamma'] )


	except Exception, err:
		logger.error("Error when getting points: %s" % err)

	logger.debug( '########################################' )
	logger.debug( 'final forecast: %s ' % forecastSerie )
	logger.debug( '############################' )

	return  forecastSerie


def exclude_points(points, subset_selection={}):
	"""unit test
	assert(exclude_points([[0,1],[0.5,2],[1,1],[2,3],[4,5],[3,1],[5,2]],{'intervals':[{'from':1,'to':3}]})\
	 == [[0, 1], [0.5, 2], [1, None], [2, None], [4, 5], [3, None], [5, 2]], True)
	"""

	# Compute exclusion periods and set a point to None value (for UI purposes) if point is in any exclusion period.
	exclusion_points = []
	if subset_selection and 'exclusion_intervals' in subset_selection:
		logger.debug('Interval exclusion detected, will apply it to output data')
		# Iterate over database point list for current metric.
		for value in points:
			is_excluded = False
			# Takes care of exclusion intervals given in parameters.
			for interval in subset_selection['exclusion_intervals']:
				if value[0] >= interval['from'] and value[0] <= interval['to']:
					is_excluded = True
					break
			if is_excluded:
				# Add a point that UI won t dispay.
				exclusion_points.append([value[0], None])
			else:
				# Nothing to do, just keep the original point
				exclusion_points.append(value)
		# returns the new computed point list for given exclusion interval
		return exclusion_points
	else:
		return points



