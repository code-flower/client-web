/* global angular */
'use strict';

angular.module('CodeFlower')
.factory('dataService', function(dbAccess, WS) {

  //// PRIVATE ////

  // an array of callbacks to call when 
  // progress is made on the clone
  var subscribers = [];

  //// THE SERVICE ////

  return {

    init: function() {
      return dbAccess.init();
    },

    enumerate: function() {
      return dbAccess.getKeys();
    },

    clone: function(repo) {
      WS.cloneRepo(repo, subscribers, function(data) {
        dbAccess.delete(data.fullName)
          .then(function() {
            dbAccess.set(data.fullName, data.cloc);
          });
      });
    },

    harvest: function(repoName) {
      return dbAccess.get(repoName)
        .then(function(data) {
          return data.tree;
        });
    },

    getIgnored: function(repoName) {
      return dbAccess.get(repoName) 
        .then(function(data) {
          return data.ignored;
        });
    },

    delete: function(repoName) {
      return dbAccess.delete(repoName);
    },

    subscribe: function(callback) {
      subscribers.push(callback);
    },

    deleteDB: dbAccess.deleteDB

  };

});
