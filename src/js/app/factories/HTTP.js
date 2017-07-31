/* global angular */
'use strict';

angular.module('CodeFlower')
.factory('HTTP', function (ORIGINS, ENDPOINTS, $http) {

  return {

    getRepo: function(repoName) {
      var url = ORIGINS.harvest + ENDPOINTS.harvest + 
                `?repo=${encodeURIComponent(repoName)}`;
      return $http.get(url)
      .then(function(res) {
        return res.data;
      });
    },

    getSamples: function() {
      var url = ORIGINS.samples + ENDPOINTS.samples;
      return $http.get(url)
      .then(function(res) {
        return res.data;
      });
    }

  };
});