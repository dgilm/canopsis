# -*- coding: utf-8 -*-
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
# along with Canopsis.  If not, see <http://www.gnu.org/licenses/>.
# ---------------------------------

from ctaskhandler import TaskHandler
import pyperfstore2


NAME = 'task_pyperfstore'


class engine(TaskHandler):
	def __init__(self, *args, **kwargs):
		super(engine, self).__init__(name=NAME, *args, **kwargs)

		self.manager = pyperfstore2.manager()

	def handle_task(self, job):
		self.manager.rotateAll()

		return (0, 'Rotation done')