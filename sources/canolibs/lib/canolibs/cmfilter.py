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

def parseRules(data, rules):
	for element in data :
		checkRuleForElement(rule, element)

def checkRuleForElement(rule, element):
	#if isinstance(element, dict):
	# element = [element]

	print "parsing rule : " + str(rule)

	#FIXME handling more than two values 
	if("$and" in rule):
		rule1 = checkRuleForElement(rule["$and"][0], element) 
		rule2 = checkRuleForElement(rule["$and"][1], element) 
		return rule1 and rule2

	if("$or" in rule):
		rule1 = checkRuleForElement(rule["$and"][0], element) 
		rule2 = checkRuleForElement(rule["$and"][1], element) 
		return rule1 or rule2

	ruleKey = rule.keys()[0]
	ruleValue = rule[ruleKey]["$eq"]

	if("$eq" in rule[ruleKey]):
		return operatorEq(ruleKey, ruleValue, element)

	if("$lt" in rule[ruleKey]):
		return operatorLt(ruleKey, ruleValue, element)

	if("$gt" in rule[ruleKey]):
		return operatorLt(ruleKey, ruleValue, element)

	#else
	return False

def operatorEq(ruleKey, ruleValue, element):
	if(ruleKey in element and element[ruleKey] == ruleValue):
		print "found " + str(element)
		return True

def operatorLt(ruleKey, ruleValue, element):
	if(ruleKey in element and element[ruleKey] < ruleValue):
		print "found " + str(element)
		return True

def operatorGt(ruleKey, ruleValue, element):
	if(ruleKey in element and element[ruleKey] > ruleValue):
		print "found " + str(element)
		return True