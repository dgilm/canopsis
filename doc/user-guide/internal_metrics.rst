Internal metrics
================

Overview
--------

Internal metrics are produced to provide helpful informations about the Canopsis system.


List of internal metrics
------------------------

.. NOTE :: TODO
   Specify for which component/resource these metrics appears, their units, and their descriptions
   Internal metrics are produced periodicaly. So their values are updated though time.

Acknowlegement
--------------

* **cps_alerts_ack** Counts alerts beeing acknowleged. it is computed at global level and for each hostgroup.

* **cps_alerts_not_ack** Counts alerts not yet acknowleged. it is computed at global level and for each hostgroup.

* **cps_alerts_ack_by_host** Counts alerts witch is ack because it's related component has been acknowledged. it is computed at global level and for each hostgroup.

* **ack_delay** Measures elapsed time between an alert date and it's acknowlegement's date.

* **ack_solved_delay** Measures elapsed time between an acknowlegement date and the alert change state to OK (0) date.

Alerting
--------

* **cps_statechange_hard** Counts every  state change for a given event witch is in **hard** state, hard state is an event's state_type key equal to 0

* **cps_statechange_soft** Counts every state change for a given event witch is in **soft** state, soft state is an event's state_type key equal to 1

* **cps_statechange** Counts every  state change for a given event

.. NOTE :: State matching

 state 0 is OK

 state 1 is WARNING

 state 2 is CRITICAL

 state 3 is UNKNOWN

* **cps_statechange_nok** Counts every  state change for a given event witch state goes from OK to NOK state. for instance state change from 0 to 1, 2 or 3

* **cps_statechange_0** Counts every  state change for a given event witch state goes from 1, 2, 3 state to 0 state

* **cps_statechange_1** Counts every  state change for a given event witch state goes from 0, 2, 3 state to 1 state

* **cps_statechange_2** Counts every  state change for a given event witch state goes from 0, 1, 3 state to 2 state

* **cps_statechange_3** Counts every  state change for a given event witch state goes from 0, 1, 2 state to 3 state

Information
-----------

* **cps_evt_per_sec** Counts how many events being  threaten each second by an engine. Resource of this metric is the engine name

* **cps_sec_per_evt** Counts how long does an event last in each engine



+-----------------------------------------+------+-------------+
| Name                                    | Unit | Description |
+=========================================+======+=============+
| cps_statechange_service_from_component  |      |             |
+-----------------------------------------+------+-------------+
| cps_evt_per_sec                         |      |             |
+-----------------------------------------+------+-------------+
| cps_sec_per_evt                         |      |             |
+-----------------------------------------+------+-------------+
| cps_queue_size                          |      |             |
+-----------------------------------------+------+-------------+
| cps_sel_state_0                         |      |             |
+-----------------------------------------+------+-------------+
| cps_sel_state_1                         |      |             |
+-----------------------------------------+------+-------------+
| cps_sel_state_2                         |      |             |
+-----------------------------------------+------+-------------+
| cps_sel_state_3                         |      |             |
+-----------------------------------------+------+-------------+