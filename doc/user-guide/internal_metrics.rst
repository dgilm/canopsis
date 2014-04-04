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



+-----------------------------------------+------+-------------+
| Name                                    | Unit | Description |
+=========================================+======+=============+
| cps_statechange                         |      |             |
+-----------------------------------------+------+-------------+
| cps_statechange_nok                     |      |             |
+-----------------------------------------+------+-------------+
| cps_statechange_0                       |      |             |
+-----------------------------------------+------+-------------+
| cps_statechange_1                       |      |             |
+-----------------------------------------+------+-------------+
| cps_statechange_2                       |      |             |
+-----------------------------------------+------+-------------+
| cps_statechange_3                       |      |             |
+-----------------------------------------+------+-------------+
| cps_statechange_hard                    |      |             |
+-----------------------------------------+------+-------------+
| cps_statechange_soft                    |      |             |
+-----------------------------------------+------+-------------+
| cps_statechange_component               |      |             |
+-----------------------------------------+------+-------------+
| cps_statechange_service                 |      |             |
+-----------------------------------------+------+-------------+
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