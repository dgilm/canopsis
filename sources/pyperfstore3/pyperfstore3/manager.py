#!/usr/bin/env python
#--------------------------------
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
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
# ---------------------------------

import logging

from pyperfstore3.store import store
from pyperfstore3.timewindow import Period

from collections import OrderedDict

import time
from datetime import datetime, timedelta

from md5 import new as md5

class CountByUnit(object):

	DEFAULT_TIME_UNIT_AND_COUNT = OrderedDict()
	DEFAULT_TIME_UNIT_AND_COUNT[Period.SECOND] = 60
	DEFAULT_TIME_UNIT_AND_COUNT[Period.MINUTE] = 60
	DEFAULT_TIME_UNIT_AND_COUNT[Period.HOUR] = 24
	DEFAULT_TIME_UNIT_AND_COUNT[Period.DAY] = 7
	DEFAULT_TIME_UNIT_AND_COUNT[Period.WEEK] = 4
	DEFAULT_TIME_UNIT_AND_COUNT[Period.MONTH] = 12
	DEFAULT_TIME_UNIT_AND_COUNT[Period.YEAR] = 5

	@staticmethod
	def get_next_unit(unit=None, metric_id=None):

		if unit is None:
			if metric_id is None:
				result = CountByUnit.DEFAULT_TIME_UNIT_AND_COUNT[0]
			else:
				raise NotImplemented("Should get unit and count information from db")
		elif metric_id is None:
			try:
				index = CountByUnit.DEFAULT_TIME_UNIT_AND_COUNT.index(unit)
				result = CountByUnit[index+1]
			except ValueError:
				raise ValueError("{0} is not in CountByUnit.DEFAULT_TIME_UNIT_AND_COUNT".format(unit))
			except IndexError:
				raise IndexError("{0} is the last unit".format(unit))

"""
ASC TIME UNIT ORDER
"""
ASC_TIME_UNIT_ORDER = list()
for time_unit in DEFAULT_TIME_UNIT_AND_COUNT: # fill ASC TIME UNIT ORDER
	ASC_TIME_UNIT_ORDER.append(time_unit)

for i in range(0, len(ASC_TIME_UNIT_ORDER)): # COVER TIME COUNT WITH GREATER PRECISION
	DEFAULT_TIME_UNIT_AND_COUNT[ASC_TIME_UNIT_ORDER[i]] *= DEFAULT_TIME_UNIT_AND_COUNT[TIME_UNIT_ORDER[i+1]]

ID = "_id"
TIMESTAMP = "timestamp"
AGGREGATION_OPERATION = "aggregation_operation"
TIME = "time"
TIME_UNIT = TIME.join("_unit")
TIME_COUNT = TIME.join("_count")
METRIC_ID = "metric_id"
LAST_PUSH = "last_push"
VALUE = "value"
VALUES = VALUES.join("s")
NO_VALUE = "no".join(VALUE)


class Manager(object):
	"""
	Manage perfdata.
	"""

	PERFDATA_DB = 'perfdata3'
	METADATA_DB = 'metadata3'

	DEFAULT_TIME_UNIT = ASC_TIME_UNIT_ORDER[1]
	DEFAULT_TIME_COUNT = DEFAULT_TIME_UNIT_AND_COUNT[DEFAULT_TIME_UNIT]


	def __init__(self, logging_level=logging.INFO, host=None, port=None, ssl=False, **kwargs):

		super(Manager, self).__init__()

		# logging
		self.logger = logging.getLogger('Manager')
		self.logger.setLevel(logging_level)

		# connection
		self.connection = pymongo.Connection(host=host, port=port, ssl=ssl, max_pool_size=5)

		# collection acquisition
		self.perfdata = self.connection['canopsis'][PERFDATA_DB]
		self.metadata = self.connection['canopsis'][METADATA_DB]

	def get_time_unit_and_count(self, metric_id, timestamp=None):
		"""
		Get metric_id time_unit and time_count related to input timestamp.
		"""

		return DEFAULT_TIME_UNIT, DEFAULT_TIME_COUNT

	@staticmethod
	def get_key_id(metric_id, aggregation_operation, timestamp):
		"""
		Generate the unique key id corresponding to input metric_id, aggregation_operation and timestamp.
		"""

		result = "{0}/{1}/{2}".format(metric_id, aggregation_operation, join)

		return result

	@staticmethod
	def get_value_document_id_timestamp(timestamp, time_unit):
		"""
		Get value document id timestamp.
		"""

		period = Period(unit=time_unit)
		result = period.sliding_time(timestamp)

		return result

	@staticmethod
	def get_value_document_id(metric_id, value_id_timestamp):
		"""
		Get value document id.
		"""

		result = str(metric_id).join('-').join(value_id_timestamp)
		return result

	@staticmethod
	def get_value_field(id_timestamp, timestamp):
		"""
		Get aggregated document value field related to id_timestamp and timestamp.
		"""

		result = str(timestamp - id_timestamp)

		return result

	@staticmethod
	def get_default_value_document(_id, metric_id, timestamp, value, value_field, aggregation_operation, time_unit, time_count):
		"""
		Get default metric value document.
		"""

		result = {
			ID: _id,
			METRIC_ID: metric_id,
			TIMESTAMP: timestamp,
			AGGREGATION_OPERATION: aggregation_operation,
			TIME_UNIT: time_unit,
			TIME_COUNT: time_count,
			VALUES: dict()
		}
		for count in range(time_count):
			result[VALUES][str(count)] = None
		result[VALUES][value_field] = value

		return result

	@staticmethod
	def get_default_metadata_document(metric_id, timestamp, metadata):
		"""
		Get default metadata document.
		"""

		result = {
			METRIC_ID: metric_id,
			TIMESTAMP: timestamp,
			VALUES: metadata
		}

		return result

	def push(self, metric_id, timestamp, perfdata, aggregation_operation=None, time_unit=None, time_count=60):
		"""
		Push metric perfdata and returns corresponding couple of (value document id, metadata id) or None if push failed.
		"""

		result = None

		# first, get right time_unit and time_count if not given
		if time_unit is None:
			time_unit, time_count = self.get_time_unit_and_count(metric_id, timestamp)

		# first save value
		value = perfdata.pop(VALUE, NO_VALUE)

		# identify right aggregated document related to id, aggregation_operation and time_unit
		# get id timestamp
		id_timestamp = Manager.get_value_document_id_timestamp(timestamp, time_unit)
		_id = Manager.get_value_document_id(metric_id, id_timestamp)

		request = {
			ID: _id,
			AGGREGATION_OPERATION: aggregation_operation,
			TIME_UNIT: time_unit
		}
		projection = {
			ID: 1,
			VALUES: 1,
		}
		value_document = self.perfdata.find_one(request)

		value_field = str(timestamp - id_timestamp)

		# if the document does not exist
		if value_document is None:
			value_document =
				Manager.get_default_value_document(
					_id,
					metric_id,
					timestamp,
					value,
					value_field,
					aggregation_operation,
					time_unit,
					time_count
					)
			self.perfdata.insert(value_document)

		else:
			update_request = {
				'$set': {
					VALUES.join('.').join(value_field): value,
					LAST_PUSH: timestamp
				}
			}
			self.perfdata.update(request, update_request)

		# then insert meta-data if they are different than previous values or didn't exist
		metadata_request = {
			METRIC_ID: metric_id
		}
		metadata_document = self.metadata.find_one(metadata_request)

		if metadata_document is None or metadata_document.get(values) != metadata: # insert metadata
			metadata_document = Manager.get_default_metadata_document(metric_id, timestamp, perfdata)
			self.metadata.insert(metadata_document)

		elif metadata_document.get(VALUES) == perfdata: # update
			if metadata_document.get(TIMESTAMP, 0) <= timestamp:
				metadata_request = {ID: metadata_document[ID]}
				metadata_update = {'$set': {TIMESTAMP: timestamp}}
				self.metadata.update(metadata_request, metadata_update)

	def get_perfdata(self, metric_id, timewindow, time_unit=None, aggregation_operation=None, with_meta=False):
		"""
		Get couple of (timestamp, perfdata) inside input timewindow and related to specific time_unit and aggregation_operation.
		"""

		perfdata_request = {
			TIMESTAMP: {}
		}
		raise NotImplemented

	def aggregate(self, metric_id, timewindow, aggregation_operation=None, time_unit=None, time_count=60):
		"""
		Aggregate metric perfdata.
		"""

		raise NotImplemented

	def delete(self, metric_id, timewindow, aggregation_operation=None, time_unit=None):
		"""
		Delete perfdata related to input metric_id, over the timewindow.
		If aggregation_operation is not None, all document related to aggregation_operation will be deleted.
		If time_unit is not None, all time_unit from Period.SECOND to time_unit will be deleted.
		"""

		raise NotImplemented

if __name__ == '__main__':
	import sys

	def help():
		print "<manager method> <manager method args>"

	manager = Manager()

	if len(sys.argv) <= 1:
		help()
	else:
		method = sys.argv[1]

		if method == "push":

			metric_id = sys.argv[2]
			timestamp = sys.argv[3]
			perfdata = json.loads(sys.argv[4])
			aggregation_operation = sys.argv[5]
			time_unit = sys.argv[6]
			time_count = sys.argv[7]

			manager.push(metric_id, timestamp, perfdata, aggregation_operation, time_unit, time_count)

		elif method == "get":
			raise NotImplemented
		elif method == "aggregate":
			raise NotImplemented
		elif method == "delete":
			raise NotImplemented
		else:
			help()
