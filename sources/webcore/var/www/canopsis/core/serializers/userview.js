/*
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
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
*/

define([
	'jquery',
	'app/lib/ember',
	'app/lib/ember-data',
	'app/application',
	'app/serializers/application'
], function($, Ember, DS, Application, ApplicationSerializer) {

	Application.UserviewSerializer = ApplicationSerializer.extend({


		_generatedIds: 0,
    
    /**
     Sideload a JSON object to the payload
     
     @method sideloadItem
     @param {Object} payload JSON object representing the payload
     @param {subclass of DS.Model} type The DS.Model class of the item to be sideloaded
     @paraam {Object} item JSON object representing the record to sideload to the payload
    */
    	sideloadItem: function(payload, type, item){
        var sideloadKey = type.typeKey.pluralize(),     // The key for the sideload array 
            sideloadArr = payload[sideloadKey] || [],   // The sideload array for this item
            primaryKey = Ember.get(this, 'primaryKey'), // the ID property key
            id = item[primaryKey];
                    
        // Missing an ID, give it one 
        if (typeof id == 'undefined') {
            id = 'generated-'+ (++this._generatedIds);
            item[primaryKey] = id;
        }
        
        // Don't add if already side loaded
        if (sideloadArr.findBy('id', id) != undefined){
            return payload;
        }
        
        // Add to sideloaded array
        sideloadArr.push(item);
        payload[sideloadKey] = sideloadArr;  
        return payload;
    },
    
    /**
     Extract relationships from the payload and sideload them. This function recursively 
     walks down the JSON tree
     
     @method sideloadItem
     @param {Object} payload JSON object representing the payload
     @paraam {Object} recordJSON JSON object representing the current record in the payload to look for relationships
     @param {Object} primaryType The DS.Model class of the record object
    */
    	extract: function(store, type, payload, id, requestType){
    		console.log("extract:userview");
    	},

    	extractFindAll: function(store, payload) {
			var userviews = [];
			console.log("Userview extractFindAll", payload);

			for(var i = 0; i < payload.data.length; i++) {
				var userview = payload.data[i];
				userviews.push(userview);
			}
			return userviews;
		},

		extractFind: function(store, payload) {
			var userviews = [];
			console.log("Userview extractFind", payload);

			return userviews;
		},

		extractSingle: function(store, type, payload, id, requestType) {
			var userview = payload.data;
			console.log("Userview extractSingle", payload);
			return userview;
		},

    	extractRelationships: function(payload, recordJSON, primaryType){
        primaryType.eachRelationship(function(key, relationship) {
            var related = recordJSON[key], // The record at this relationship
                type = relationship.type;  // belongsTo or hasMany
            
            if (related){
                
                // One-to-one
                if (relationship.kind == 'belongsTo') {
                    // Sideload the object to the payload
                    this.sideloadItem(payload, type, related);
    
                    // Replace object with ID
                    recordJSON[key] = related.id;
                    
                    // Find relationships in this record
                    this.extractRelationships(payload, related, type);
                }
                
                // Many
                else if (relationship.kind == 'hasMany') {
                    // Loop through each object
                    related.forEach(function(item, index){
    
                        // Sideload the object to the payload
                        this.sideloadItem(payload, type, item);
    
                        // Replace object with ID
                        related[index] = item.id;
                        
                        // Find relationships in this record
                        this.extractRelationships(payload, item, type);
                    }, this);
                }
                
            }
        }, this);
        
        return payload;
    },
    
    /**
     Overrided method
    */
    normalizePayload: function(type, payload) {
    	console.log("normalizePayload:userview");
        var typeKey = type.typeKey,
            typeKeyPlural = typeKey.pluralize();
        
        payload = this._super(type, payload);
        
        // Many items (findMany, findAll)
        if (typeof payload[typeKeyPlural] != 'undefined'){
            payload[typeKeyPlural].forEach(function(item, index){
                this.extractRelationships(payload, item, type);
            }, this);
        }
        
        // Single item (find)
        else if (typeof payload[typeKey] != 'undefined'){
            this.extractRelationships(payload, payload[typeKey], type);
        }
        
        return payload;
    }

});
return Application.UserviewSerializer;
});