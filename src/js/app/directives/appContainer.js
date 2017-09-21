/* global angular */
'use strict';

angular.module('CodeFlower')
.directive('appContainer', function(PARTIALS_DIR, FEATURES, state, $uibModal, Fullscreen) {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: PARTIALS_DIR + 'app-container.html',
    controller: 'dispatcher',
    link: link
  };

  function link (scope, el, attrs) {
    scope.state = state;
    scope.isFullscreen = false;
    scope.multipleRepos = FEATURES.multipleRepos;

    scope.openModal = function() {
      $uibModal.open({
        controller: 'mainModal',
        templateUrl: PARTIALS_DIR + 'modals/main-modal.html',
        animation: false
      });
    };

    scope.toggleFullscreen = function() {
      scope.isFullscreen = !scope.isFullscreen;
    };
  }

});