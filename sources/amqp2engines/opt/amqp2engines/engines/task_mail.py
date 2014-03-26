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
from caccount import caccount, caccount_get
from cstorage import cstorage
from cfile import cfile, cfile_get

from email import Encoders
from email.MIMEBase import MIMEBase
from email.MIMEText import MIMEText
from email.MIMEMultipart import MIMEMultipart
from email.Utils import formatdate

import smtplib
import socket
import time
import re


NAME = 'task_mail'


class engine(TaskHandler):
	def __init__(self, *args, **kwargs):
		super(engine, self).__init__(name=NAME, *args, **kwargs)


	def handle_task(self, job):
		user = job.get('user', 'root')

		storage = get_storage('object', account=caccount(user='root', group='root'))
		account = caccount_get(storage, user)
		del storage

		recipients = job.get('recipients', [])
		subject = job.get('subject', None)
		body = job.get('body', None)
		attachments = job.get('attachments', [])
		smtp_host = job.get('smtp_host', 'localhost')
		smtp_port = job.get('smtp_port', 25)
		html = job.get('html', False)

		# Execute the task
		return self.sendmail(account, recipients, subject, body, smtp_host, smtp_port, html)

	def sendmail(self, account, recipients, subject, body, attachments, smtp_host, smtp_port, html):
		"""
			:param account: User used to fetch data from MongoDB.
			:type: account: caccount

			:param recipients: Users who will receive the mail.
			:type recipients: list of mail string

			:param subject: Mail's subject.
			:type subject: str

			:param body: Mail's body.
			:type body: str

			:param attachments: Mail's attachments.
			:type attachments: list of cfile id

			:param smtp_host: SMTP Server address.
			:type smtp_host: str

			:param smtp_port: SMTP Server port.
			:type smtp_port: int

			:param html: Indicates if the mail contains HTML.
			:type html: boolean

			:returns: (<state>, <output>)
		"""

		# Verify account
		account_firstname = account.firstname
		account_lastname = account.lastname
		account_mail = account.mail

		if not account_mail:
			self.logger.info('No mail adress for this user (Fill the mail account field)')
			account_mail = '{0}@{1}'.format(account.user, socket.gethostname())

		if isinstance(account_mail, (list, tuple)):
			account_mail = account_mail[0]

		if not account_lastname and not account_firstname:
			account_full_mail = '"{0}" <{1}>'.format(
				account_mail.split('@')[0].title(),
				account_mail
			)

		else:
			account_full_mail = account.get_full_mail()

		if not re.match("^[a-zA-Z0-9._%-]+@[a-zA-Z0-9._%-]+.([a-zA-Z]{2,6})?$", str(account_mail)):
			return (
				2,
				'Invalid Email format for sender: {0}'.format(account_mail)
			)

		# Verify recipients
		if not recipients:
			return (2, 'No recipients configured')

		dests = []

		for dest in recipients:
			if re.match("^[a-zA-Z0-9._%-]+@[a-zA-Z0-9._%-]+.([a-zA-Z]{2,6})?$", dest):
				dest_mail = dest
				dest_full_mail = '"{0}" <{1}>'.format(
					dest_mail.split('@')[0].title(),
					dest_mail
				)
				dests.append(dest_full_mail)

		dests_str = ', '.join(dests)

		# Send

		msg = MIMEMultipart()
		msg["From"] = account_full_mail
		msg["To"] = dests_str
		msg["Subject"] = subject

		if html:
			msg.attach(MIMEText(body, 'html'))

		else:
			msg.attach(MIMEText(body, 'plain'))

		msg['Date'] = formatdate(localtime=True)

		if attachments:
			storage = get_storage('object', account=account)

			for file_id in attachments:
				part = MIMEBase('application', "octet-stream")

				_file = cfile_get(file_id, storage)

				content_file = _file.get(storage)
				part.set_payload(content_file)
				Encoders.encode_base64(part)
				part.add_header('Content-Disposition', 'attachment; filename="%s"' % _file.data['file_name'])
				part.add_header('Content-Type', _file.data['content_type'])
				msg.attach(part)

			del storage

		s = socket.socket()

		try:
			s.connect((smtp_host, smtp_port))

		except Exception as err:
			return (
				2,
				'Connection to SMTP <{0}:{1}> failed: {2}'.format(smtp_host, smtp_port, err)
			)

		try:
			server = smtplib.SMTP(smtp_host, smtp_port)
			server.sendmail(account_full_mail, dests, msg.as_string())
			server.quit()

		except Exception, err:
			return (
				2,
				"Imposible to send mail: {0}".format(err)
			)
