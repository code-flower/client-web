/* global angular */
'use strict';

angular.module('CodeFlower')
.factory('dataService', function(dbAccess, WS, API, $rootScope) {

  //// PRIVATE ////

  // an array of callbacks to call when 
  // progress is made on the clone
  var subscribers = [];

  function onCloneSuccess(data) {
    $rootScope.$broadcast('cloneComplete', data);
    return dbAccess.delete(data.fullName)
      .then(function() {
        return dbAccess.set(data.fullName, data);
      })
      .then(function() {
        return data;
      });
  }

  function onCloneError(err) {
    var eNames = API.errorNames;
    switch(err.name) {
      case eNames.NeedCredentials:
        $rootScope.$broadcast('needCredentials', {
          params: err.params
        });
        break;
      case eNames.CredentialsInvalid:
        $rootScope.$broadcast('needCredentials', {
          params: err.params,
          invalid: true
        });
        break;
      default:
        console.log('Unhandled error:', message.data);
        $rootScope.$broadcast('cloneError', message.data);
        break;
    }
    return err;
  }

  function onCloneNotify(data) {
    subscribers.forEach(function(subscriber) {
      subscriber(data.text);
    });
  }

  //// THE SERVICE ////

  return {

    init: function() {
      return dbAccess.init();
    },

    enumerate: function() {
      return dbAccess.getKeys();
    },

    clone: function(repo) {
      return WS.cloneRepo(repo)
        .then(onCloneSuccess, onCloneError, onCloneNotify);
    },

    harvest: function(repoName) {
      return dbAccess.get(repoName);
    },

    getIgnored: function(repoName) {
      return dbAccess.get(repoName) 
        .then(function(data) {
          return data.cloc.ignored;
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
