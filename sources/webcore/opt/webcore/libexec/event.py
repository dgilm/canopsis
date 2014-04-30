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

import logging, json, time

import bottle
from bottle import route, get, put, delete, request, HTTPError, post, response

## Canopsis
from caccount import caccount
from cstorage import cstorage
from cstorage import get_storage
from crecord import crecord
from camqp import camqp
import cevent

#import protection function
from libexec.auth import get_account, check_group_rights

logger = logging.getLogger('Event')
logger.setLevel(logging.INFO)

amqp = None
group_managing_access = 'group.CPS_event_admin'

##################################################################################

## load functions
def load():
	global amqp
	amqp = camqp(logging_name="Event-amqp")
	amqp.start()

def unload():
	global amqp
	if amqp:
		amqp.stop()
		amqp.join()

##################################################################################

## Handlers

@post('/event/',checkAuthPlugin={'authorized_grp':group_managing_access})
def send_event(	routing_key=None):

	try:
		data = request.body.readline()
		data = json.loads(data)
	except:
		data = dict(request.params)

	logger.debug(data)

	#-----------------------get params-------------------
	timestamp = data.get('timestamp', None)
	if timestamp is None:
		data['timestamp'] = time.time()
	elif not isinstance(timestamp, int):
		data['timestamp'] = int(timestamp)

	mandatory_fields = ['connector', 'connector_name', 'event_type', 'source_type', 'component', 'state']

	for field in mandatory_fields:
		if data.get(field, None) is None:
			message = 'Missing {} argument in payload'.format(field)
			logger.error(message)
			return HTTPError(400, message)

	if data.get('state_type', None) is None:
		data['state_type'] = 1

	def json2py(data, key):
		value = data.get(key, None)
		if value:
			try:
				value = json.loads(value)
			except Exception, err:
				logger.error("Impossible to parse '{}' (%s)" % (key, err))

		if not isinstance(value, list):
			value = []
		data[key] = value

	json2py(data, 'tags')
	json2py(data, 'perf_data_array')


	#------------------------------forging event----------------------------------
	logger.info('AUTOR '+ data.get('author', None))
	event = cevent.forger(
		connector = data.get('connector', None),
		connector_name = data.get('connector_name', None),
		event_type = data.get('event_type', None),
		source_type = data.get('source_type', None),
		component = data.get('component' ,None),
		resource= data.get('resource', None),
		state = int(data.get('state', None)),
		state_type = int(data.get('state_type', None)),
		output = data.get('output',None),
		long_output = data.get('long_output', None),
		perf_data = data.get('perf_data', None),
		perf_data_array = data.get('perf_data_array', None),
		timestamp = data.get('timestamp', None),
		display_name = data.get('display_name', None),
		tags = data.get('tags', None),
		ticket = data.get('ticket', None),
		ref_rk = data.get('ref_rk', None),
		cancel = data.get('cancel', None),
		author = data.get('author', None),
	)

	logger.debug('Event crafted {}'.format(event))

	#------------------------------AMQP Part--------------------------------------

	key = cevent.get_routingkey(event)

	global amqp
	amqp.publish(event, key, amqp.exchange_name_events)

	logger.debug('Amqp event published')

	return {'total':1,'success':True,'data':{'event':event}}
