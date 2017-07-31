/* global angular */
'use strict';

angular.module('CodeFlower')
.directive('appContainer', function(PARTIALS_DIR, state, $uibModal) {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: PARTIALS_DIR + 'app-container.html',
    controller: 'dispatcher',
    link: link
  };

  function link (scope, el, attrs) {
    scope.state = state;

    scope.openModal = function() {
      $uibModal.open({
        controller: 'mainModal',
        templateUrl: PARTIALS_DIR + 'modals/main-modal.html',
        animation: false
      });
    };

    // for testing modal
    // setTimeout(function() {
    //    scope.openPrefs();
    // }, 500);
  }

});