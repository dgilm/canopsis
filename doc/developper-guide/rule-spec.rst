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
        'type': 'pass|drop|override',

	// Specific to override action
	'field':            // Fiels to override
	'value':	    // Value to override with
    }

Action Structure
---------------------

.. code-block:: javascript

    'actions': [{
        'type': 'pass|drop|override',

	// Specific to override action
	'field':            // Fiels to override
	'value':	    // Value to override with
    },...]

