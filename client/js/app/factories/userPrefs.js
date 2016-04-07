/* global angular */
'use strict';

angular.module('CodeFlower')
.factory('userPrefs', function(appConfig) {

  return {
    get: function(pref) {
      return localStorage[pref] || appConfig.defaultPrefs[pref];
    },

    set: function(pref, val) {
      localStorage[pref] = val;
    }
  };

});