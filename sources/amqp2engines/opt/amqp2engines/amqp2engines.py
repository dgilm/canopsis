#!/usr/bin/env python
#--------------------------------
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


from ConfigParser import RawConfigParser, ConfigParser, ParsingError
import importlib

import unittest
import logging
import inspect
import socket
import time
import json

from ctaskhandler import TaskHandler
from cstorage import get_storage
from caccount import caccount
from cinit import cinit

## Engines path
import sys, os
sys.path.insert(0, os.path.expanduser('~/opt/amqp2engines/engines/'))

## Configurations
DAEMON_NAME="amqp2engines"

init 	= cinit()
logger 	= init.getLogger(DAEMON_NAME, level="INFO")
handler = init.getHandler(logger)

engines=[]

## Very Dirty HACK !
## Remove old queues (temporary workaround)
amqp_config = RawConfigParser()
section = 'master'
amqp_config.read(os.path.expanduser("~/etc/amqp.conf"))
amqp_host = amqp_config.get(section, "host")
amqp_port = amqp_config.getint(section, "port")
amqp_userid = amqp_config.get(section, "userid")
amqp_password = amqp_config.get(section, "password")
amqp_virtual_host = amqp_config.get(section, "virtual_host")

import subprocess
subprocess.call('rabbitmqadmin -H %s --vhost=%s --username=%s --password=%s delete queue name="amqp2engines"'
	% (amqp_host, amqp_virtual_host, amqp_userid, amqp_password), shell=True)
subprocess.call('rabbitmqadmin -H %s --vhost=%s --username=%s --password=%s delete queue name="amqp2engines_alerts"'
	% (amqp_host, amqp_virtual_host, amqp_userid, amqp_password), shell=True)

###### END of HACK ####

LOGLEVELS = {
	'info': logging.INFO,
	'warning': logging.WARNING,
	'error': logging.ERROR,
	'debug': logging.DEBUG
}

CONFIG_PARAMS = {
	'next': list,
	'next_balanced': bool,
	'name': basestring,
	'beat_interval': int,
	'exchange_name': basestring,
	'routing_keys': list,
	'logging_level': lambda lvl: LOGLEVELS[lvl]
}

def start_engines():
	global engines

	# Check if configuration exists
	confpath = os.path.expanduser('~/etc/amqp2engines.conf')
	if not os.path.exists(confpath):
		logger.error("Can't find configuration file at '%s'" % confpath)
		return False

	try:
		config = ConfigParser()
		config.read(confpath)

	except ParsingError, err:
		logger.error(str(err))
		return False

	# Parse configuration

	for section in config.sections():
		# We only want engines
		if not section.startswith('engine:'):
			continue

		# Ignore 'engine:' for engine's name
		engine_name = section[7:]

		# If there is more :, ignore the rest, it's just to make the section name unique
		engine_name = engine_name.split(':')[0]

		# Try to load the engine
		try:
			engine = importlib.import_module(engine_name)

		except ImportError:
			logger.error("No engine named '%s' found" % engine_name)
			return False

		# Engine loaded, get configuration
		logger.info('Reading configuration for engine %s' % engine_name)

		engine_conf = {}
		engine_extra = {}

		for item in config.items(section):
			param = item[0]
			value = item[1]

			if param not in CONFIG_PARAMS:
				logger.warning("Unknown parameter '%s', assuming it's a string" % param)

				engine_extra[param] = value
				continue

			# If the parameter is a list, then parse the list in CSV format
			if CONFIG_PARAMS[param] is list:
				import csv

				parser = csv.reader([value])

				value = []

				for row in parser:
					value += row

			elif CONFIG_PARAMS[param] is int:
				value = config.getint(section, param)

			elif CONFIG_PARAMS[param] is bool:
				value = config.getboolean(section, param)

			elif CONFIG_PARAMS[param] is float:
				value = config.getfloat(section, param)

			elif not inspect.isclass(CONFIG_PARAMS[param]) and callable(CONFIG_PARAMS[param]):
				value = CONFIG_PARAMS[param](value)

			# In all other case, we keep the original string value fetched via item[1]

			engine_conf[param] = value

		# Configuration loaded
		logger.info("Loading engine '%s' with the following configuration: %s" % (engine_name, engine_conf))

		# Now, we translate the 'next' parameter to the 'next_amqp_queues'
		if 'next' in engine_conf:
			engine_conf['next_amqp_queues'] = ['Engine_%s' % next for next in engine_conf['next']]
			del engine_conf['next']

		# Create the engine and set the extra configuration
		loaded_engine = engine.engine(**engine_conf)

		for param in engine_extra:
			setattr(loaded_engine, param, engine_extra[param])

		engines.append(loaded_engine)

	# Update engines collection

	storage = get_storage('engines', account=caccount(user='root', group='root')).get_backend()
	hostname = socket.getfqdn() or socket.gethostname()

	storage.remove({
		'host': hostname
	})

	for engine in engines:
		document = {
			'type': 'engine',
			'name': engine.name,
			'host': hostname
		}

		if engine.__class__.__base__ is TaskHandler:
			document['type'] = 'taskhandler'

		# avoid duplicates
		if storage.find(document).count() == 0:
			storage.insert(document)

	del storage

	##################
	# Start engines
	##################

	logger.info("Start engines")
	for engine in engines:
		engine.start()

	return True

def stop_engines():
	logger.info("Stop engines")
	for engine in engines:
		engine.signal_queue.put("STOP")
	
	logger.info("Join engines")
	for engine in engines:
		engine.join()
		while engine.is_alive():
			time.sleep(0.1)

	time.sleep(0.5)

def main():
	global amqp

	logger.info("Initialize process")
	handler.run()

	logger.info("Start Engines")

	if not start_engines():
		logger.error("A problem occurred, exiting...")
		sys.exit(1)
	
	logger.info("Waiting ...")
	handler.wait()
	
	stop_engines()

	logger.info("Process finished")
	
if __name__ == "__main__":
	main()
