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

from cengine import cengine
from caccount import caccount
from cstorage import get_storage
import time
import md5

NAME="outputs"
TOP10_LIMIT = 10

class engine(cengine):
	def __init__(self, name=NAME, *args, **kwargs):
		super(engine, self).__init__(name=name, *args, **kwargs)
		self.logger.setLevel('DEBUG')
		self.account = caccount(user='root', group='root')
		self.storage = get_storage(logging_level=self.logging_level, account=self.account)
		self.top10 = self.storage.get_backend('top10')
		self.outputs = self.storage.get_backend('outputs')
		self.entities = self.storage.get_backend('entities')
		self.perfdata2 = self.storage.get_backend('perfdata2')
		self.events_log = self.storage.get_backend('events_log')

	def work(self, event, *args, **kwargs):
		pass

	def beat(self):

		self.max_entities_alerts('co', self.reload_entity('component'))
		self.max_entities_alerts('re', self.reload_entity('resource'))

	def reload_entity(self, entity_type):
		self.logger.debug('reloading ' + entity_type)
		entities = {}
		entities_query = self.entities.find({'type': entity_type, 'component': {'$ne': '__canopsis__'} }, {'_id': 0, 'name': 1})
		for entity in entities_query:
			entities[entity['name']] = 1

		return entities

	def most_recurrent_output(self):
		pass
		"""
		query = self.events_log.find({'output': {'$ne': None}, 'state': {'$ne': 0}}, {'_id': 0, 'component': 1, 'resource': 1, 'output': 1})
		cache = {}
		for output_query in query:
			output_hash = md5.new(output_query['output'].encode('utf8')).hexdigest()
			if 'resource' in output_query:
				key = (output_hash, output_query['resource'], output_query['component'])
				if key in cache:
					cache[key]['count'] += 1
				else:
					cache[key] = {'count': 1, 'output': output_query['output']}
			else:
				key = (output_hash, output_query['component'])
				if key in cache:
					cache[key]['count'] += 1
				else:
					cache[key] = {'count': 1, 'output': output_query['output']}

		return cache
		"""

	def max_entities_alerts(self, metric_type, compare_list):

		"""
		computation for top 10 in nok statement
		"""
		query = self.perfdata2.find({'me': 'cps_statechange_nok', 'co': {'$ne': '__canopsis__'}}, {'_id': 0, 'lv': 1, 'co': 1, 're': 1 }, sort=[('lv', -1)])
		results = []
		for result in query:
			if metric_type in result and result[metric_type] in compare_list:
				results.append(result)
			if len(results) >= TOP10_LIMIT:
				break

		changed = False
		previous_top = self.top10.find_one({'metric': 'cps_statechange_nok', 'type': metric_type}, sort=[('$natural', 1)])
		if previous_top:
			for x, result in enumerate(previous_top['results']):
				if result != results[x]:
					changed = True
					self.logger.debug('Top 10 component changed')
					break
		else:
			changed = True

		if changed:
			self.logger.debug('Will insert new top 10')
			top10 = {
				'results': results,
				'metric': 'cps_statechange_nok',
				'timestamp': time.time(),
				'type': metric_type
			}
			self.top10.insert(top10)

if __name__ == '__main__':
	e = engine()
	e.beat()