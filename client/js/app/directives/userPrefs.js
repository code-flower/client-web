/* global angular */
'use strict';

angular.module('CodeFlower')
.directive('userPrefs', function(appConfig, state, userPrefsService) {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: appConfig.paths.partials + 'user-prefs.html',
    scope: {
      closeModal: '='
    },
    link: link
  };

  function link(scope, el, attrs) {

    //// SCOPE VARS ////

    scope.colorSchemes = Object.keys(appConfig.colorSchemes);
    scope.selectedScheme = state.colorScheme;

    //// SCOPE FUNCTIONS ////

    scope.savePrefs = function() {
      userPrefsService.set('colorScheme', scope.selectedScheme);
      scope.closeModal();
      scope.$emit('prefsChanged', {
        prefs: {
          colorScheme: scope.selectedScheme
        }
      });
    };

    scope.deleteDB = function() {
      scope.$emit('deleteDB');
    };
  }

});