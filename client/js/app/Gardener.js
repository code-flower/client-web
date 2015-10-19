/* global angular */
'use strict';

angular.module('CodeFlower')
.factory('Gardener', function($rootScope, $http) {

  //// PRIVATE ////

  // an array of callbacks to call when the
  // eventsource receives a message
  var subscribers = [];

  // gets a flower from the backend,
  // either though git clone or git pull
  function getFlower(url) {
    var source = new EventSource(url);

    source.onmessage = function(event) {
      if (event.data === 'ERROR') {
        source.close();

      } else if (event.data.match(/END:/)) {
        source.close();
        $rootScope.$broadcast('flowerReady', { 
          repoName: event.data.replace('END:', '') 
        });

      } else {
        // notify subscribers of the flower's growth
        subscribers.forEach(function(subscriber) {
          subscriber(event.data);
        });
      }
    };
  }

  //// THE SERVICE ////

  return {

    // grow a flower from a git clone url
    clone: function(url) {
      getFlower('/clone?url=' + encodeURIComponent(url));
    },

    // update a flower
    pull: function(repoName) {
      getFlower('/pull?repo=' + encodeURIComponent(repoName));
    },

    // pluck a flower from the garden
    harvest: function(repoName) {
      var url = 'data/' + repoName + '.json';
      return $http.get(url)
      .then(function(res) {
        return res.data;
      });
    },

    // list the flowers in the garden
    enumerate: function() {
      return $http.get('/repos')
      .then(function(res) {
        return res.data;
      });
    },

    // add a subscriber
    subscribe: function(callback) {
      subscribers.push(callback);
    }
  };

});