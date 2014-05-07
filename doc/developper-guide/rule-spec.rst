Rule specification
===================

Basic Rule Structure
---------------------

Here is the basic rule structure :

.. code-block:: javascript

    {
        'name':		    // Rule name
        'crecord_name':     // cRecord name
        'description':      // Short description of the rule
	'mfilter':	    // Filter to match
        'actions':          // Actions to apply
        'time_conditions':  // Optional - specific to downtime events
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
* ``OPERATOR``: in ['$eq', '$ne', '$gt', '$gte', '$lt', '$lte']
* ``VALUE_LIST``: a list of ``VALUE``


Action Structure
---------------------

.. code-block:: javascript

    'actions': [{
        'type': 'pass|drop|override',

	// Specific to override action
	'field':            // Fiels to override
	'value':	    // Value to override with
    },...]



See `event_filter-Myunittest <https://github.com/capensis/canopsis/blob/25612145b7ebbbde318f499eb52a01bef375cb76/sources/amqp2engines/opt/amqp2engines/unittest/event_filter-Myunittest.py>`_ for examples
