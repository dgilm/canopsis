
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
from ctools import parse_perfdata, clean_mfilter
from ctools import cleanTimestamp
from ctools import internal_metrics

import pyperfstore2
import pyperfstore2.utils

manager = None

logger = logging.getLogger("perfstore")
logger.setLevel(logging.DEBUG)

def load():
	global manager
	manager = pyperfstore2.manager(logging_level=logging.INFO)

def unload():
	global manager
	del manager

group_managing_access = ['group.CPS_perfdata_admin']
#########################################################################

TIMEWINDOW = 'timewindow'
TIMESERIE = 'timeserie'
FORECAST = 'forecast'
THRESHOLDS = 'thresholds'

EXCLUSION_INTERVALS = 'exclusion_intervals'

#### POST@
@post('/perfstore/values')
@post('/perfstore/values/:start/:stop')
def perfstore_nodes_get_values(start=None, stop=None):

	interval = None
	metas = request.params.get('nodes', default=None)
<<<<<<< HEAD

	timeserie = request.params.get(TIMESERIE, default=None)
	forecast = request.params.get(FORECAST, default=None)
	thresholds = request.params.get(THRESHOLDS, default=None)

	exclusion_intervals = request.params.get(EXCLUSION_INTERVALS, default=[])

	timewindow = pyperfstore2.utils.TimeWindow(start=start, stop=stop, exclusion_intervals=exclusion_intervals)

	if timeserie:
		logger.debug('timeserie: %s' % timeserie)
		timeserie = json.loads(timeserie)
		timeserie[TIMEWINDOW] = timewindow
		timeserie = pyperfstore2.utils.TimeSerie.get_timeserie(**timeserie)

		if forecast:
			logger.debug('forecast: %s' % forecast)
			forecast = json.loads(forecast)
			forecast[TIMESERIE] = timeserie
			forecast = pyperfstore2.utils.Forecast(**forecast)

	if thresholds:
		logger.debug('thresholds: %s' % thresholds)
		thresholds = json.loads(thresholds)
		thresholds = pyperfstore2.utils.Thresholds(**thresholds)

	consolidation_method 		= request.params.get('consolidation_method', default=None)

	timezone = int(request.params.get('timezone', default=0))

	output = []

=======
		
	aggregate_method			= request.params.get('aggregate_method', default=None)
	aggregate_interval			= request.params.get('aggregate_interval', default=None)
	aggregate_max_points		= request.params.get('aggregate_max_points', default=None)
	aggregate_round_time        = request.params.get('aggregate_round_time', default=None)
	consolidation_method 		= request.params.get('consolidation_method', default=None)
	timezone                    = request.params.get('timezone', default=0)

	output = []
	
>>>>>>> develop
	if not metas:
		logger.warning("Invalid arguments")
		return HTTPError(404, "Invalid arguments")

	metas = json.loads(metas)

	logger.debug("POST:")
<<<<<<< HEAD
	logger.debug(" + metas: %s" % metas)
	logger.debug("timewindow: %s" % timewindow)
	logger.debug("timeserie: %s" % timeserie)
	logger.debug("forecast: %s" % forecast)
	logger.debug("thresholds: %s" % thresholds)
	logger.debug("consolidation_method: %s" % consolidation_method)
	logger.debug("timezone: %s" % timezone)
=======
	logger.debug(" + metas: %s" % metas)	
	logger.debug(" + aggregate_method: %s" % aggregate_method)
	logger.debug(" + aggregate_interval: %s" % aggregate_interval)
	logger.debug(" + aggregate_max_points: %s" % aggregate_max_points)
	logger.debug(" + aggregate_round_time: %s" % aggregate_round_time)
	logger.debug(" + consolidation_method: %s" % consolidation_method)
	logger.debug(" + timezone: %s" % timezone)
>>>>>>> develop

	output = []

	for meta in metas:
		_id = meta.get('id', None)

		# TODO: for futur version, use only this !
		mstart = meta.get('from', start)
		mstop = meta.get('to', stop)

		timewindow.start = mstart
		timewindow.stop = mstop

		if _id:
<<<<<<< HEAD
			values = perfstore_get_values(	_id=meta['id'],
											timewindow=timewindow,
											timeserie=timeserie,
											forecast=forecast,
											thresholds=thresholds,
											timezone=timezone)

			output += values
=======
			output += perfstore_get_values(	_id=meta['id'],
											start=mstart,
											stop=mstop,
											aggregate_method=aggregate_method,
											aggregate_interval=aggregate_interval,
											aggregate_max_points=aggregate_max_points,
											aggregate_round_time=aggregate_round_time,
											timezone=time.timezone)
>>>>>>> develop

	if consolidation_method and len(output) and aggregate_method != 0:
		# select right function
		if consolidation_method == 'average':
			fn = pyperfstore2.utils.average
		elif consolidation_method == 'min':
			fn = min
		elif consolidation_method == 'max' :
			fn = max
		elif consolidation_method == 'sum':
			fn = sum
		elif consolidation_method == 'delta':
			fn = lambda x: x[0] - x[-1]

		series = []
		for serie in output:
			series.append(serie["values"])
		output = [{
			'node': output[0]['node'],
			'metric': consolidation_method,
			'bunit': None,
			'type': 'GAUGE',
			'values': pyperfstore2.utils.consolidation(series, fn, 60)
		}]

	output = {'total': len(output), 'success': True, 'data': output}

	return output

#### GET@
@get('/perfstore')
@get('/perfstore/get_all_metrics')
def perstore_get_all_metrics():
	logger.debug("perstore_get_all_metrics:")
	
	limit		= int(request.params.get('limit', default=20))
	start		= int(request.params.get('start', default=0))
	search		= request.params.get('search', default=None)
	filter		= request.params.get('filter', default=None)
	sort		= request.params.get('sort', default=None)
	show_internals	= request.params.get('show_internals', default=False)

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

	data  = manager.find(limit=0, skip=0, mfilter=mfilter, data=False, sort=msort)
	total = data.count()
	data  = [meta for meta in data.skip(start).limit(limit)]

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
	time_window				= int(request.params.get('time_window', default=86400))
	threshold				= request.params.get('threshold', default=None)
	threshold_direction 	= int(request.params.get('threshold_direction', default=-1))
	expand 					= request.params.get('expand', default=False)
	percent					= request.params.get('percent', default=False)
	threshold_on_pct		= request.params.get('threshold_on_pct', default=False)
	report					= request.params.get('report', default=False)

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
<<<<<<< HEAD


=======
	
>>>>>>> develop
	return {'success': True, 'data' : data, 'total' : len(data)}

########################################################################
# Functions
########################################################################

<<<<<<< HEAD
def perfstore_get_values(_id, timewindow, timeserie=None, forecast=None, thresholds=None, timezone=time.timezone):
=======
def perfstore_get_values(_id, start=None, stop=None, aggregate_method=None, aggregate_interval=None, aggregate_max_points=None, aggregate_round_time=True, timezone=0):
	
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
>>>>>>> develop

	logger.debug("Perfstore get points:")
	logger.debug(" + meta _id:    %s" % _id)
	logger.debug(" + start:       %s (%s)" % (timewindow.start, datetime.utcfromtimestamp(timewindow.start)))
	logger.debug(" + stop:        %s (%s)" % (timewindow.stop, datetime.utcfromtimestamp(timewindow.stop)))
	logger.debug(" + timezone:    %s" % timezone)
	
	output=[]
	meta = None

	if not _id:
		logger.error("Invalid _id '%s'" % _id)
		return output

<<<<<<< HEAD
=======
	if aggregate_interval:
		aggregate_max_points = int( round((stop - start) / aggregate_interval + 0.5) )
		fill = True
	
>>>>>>> develop
	try:
		points = []
		F = []

		if timewindow.start == timewindow.stop:
			# Get only one point
			logger.debug("   + Get one point!")
			(meta, point) = manager.get_point(	_id=_id,
												ts=timewindow.start,
												return_meta=True)

			if point:
				points = [ point ]

			logger.debug('Point: %s' % points)

		else:

			(meta, points) = manager.get_points(	_id=_id,
													tstart=timewindow.start,
													tstop=timewindow.stop,
													return_meta=True)

			# For UI display
			if len(points) == 0 and meta['type'] == 'COUNTER':
				points = [(timewindow.start, 0), (timewindow.stop, 0)]

			if len(points) and meta['type'] == 'COUNTER':
				# Insert null point for aggregation
				points.insert(0, [points[0][0], 0])

<<<<<<< HEAD
			if len(points) and timeserie:
				logger.debug('time serie')
				points =  pyperfstore2.utils.timeserie(points=points,
														timewindow=timewindow,
														timeserie=timeserie,
														forecast=forecast,
														thresholds=thresholds,
=======
			if len(points) and aggregate_method:
				points =  pyperfstore2.utils.aggregate(	points=points,
														max_points=aggregate_max_points,
														interval=aggregate_interval,
														atype=aggregate_method,
														start=start,
														stop=stop,
														fill=fill,
														roundtime = aggregate_round_time,
>>>>>>> develop
														timezone=timezone)

				logger.debug('time serie %s' % len(points))

				if forecast:					
					F = pyperfstore2.utils.forecast(points=points, forecast=forecast)
					logger.debug('forecast %s' % len(F))

	except Exception, err:
		logger.error("Error when getting points: %s" % err)

	if points and meta:
		entry = {'node': _id, 'metric': meta['me'], 'values': points, 'bunit': meta['unit'], 'min': meta['min'], 'max': meta['max'], 'thld_warn': meta['thd_warn'], 'thld_crit': meta['thd_crit'], 'type': meta['type']}
		output.append(entry)

		if len(points) and forecast:
			entry = entry.copy()
			entry['values'] = F
			entry['metric'] += '_forecast'
			output.append(entry)

	return output
