Rule specification
===================

Basic Rule Structure
---------------------

Here is the basic rule structure :

.. code-block:: javascript

    {
        'name':		    // string - Rule name
        'crecord_name':     // string - cRecord name
        'description':      // string - Short description of the rule
	'mfilter':	    // dictrionary - Filter to match
        'actions':          // list - Actions to apply
        'time_conditions':  // list - Optional - specific to downtime events
        'priority':	    // integer - Priority of the rule
    }

mFilter Structure
---------------------

.. code-block:: javascript

    'mfilter': {
        FIELD: VALUE | {OPERATOR: VALUE | [VALUE_LIST]}
    }

With :

* ``FIELD``: a valid field of event (see event-spec)
* ``VALUE``: a value to match
* ``OPERATOR``: ``['$eq', '$ne', '$gt', '$gte', '$lt', '$lte']``
* ``VALUE_LIST``: a list of ``VALUE``


Action Structure
---------------------

.. code-block:: javascript

    'actions': [{
        'type': 'pass|drop|override',

	// Specific to override action
	'field':            // Field to override
	'value':	    // Value to override with
    },...]


Time Structure
---------------------

.. code-block:: javascript

	'time_conditions': [{
		'type': 'time_interval',
		'always': True|False,
		'startTs':		//Timestamp of start time
		'stopTs':		//Timestamp of stop time
		},...]
		
See `event_filter-Myunittest <https://github.com/capensis/canopsis/blob/25612145b7ebbbde318f499eb52a01bef375cb76/sources/amqp2engines/opt/amqp2engines/unittest/event_filter-Myunittest.py>`_ for examples
