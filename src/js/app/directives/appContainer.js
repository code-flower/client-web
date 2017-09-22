/* global angular */
'use strict';

angular.module('CodeFlower')
.directive('appContainer', function(PARTIALS_DIR, FEATURES, state, $uibModal, $timeout, Fullscreen, flowerUtils) {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: PARTIALS_DIR + 'app-container.html',
    controller: 'dispatcher',
    link: link
  };

  function link (scope, el, attrs) {

    //// PRIVATE FUNCTIONS ////

    // fires the handler when the size of the screen actually
    // changes. Fires automatically after 3 resize events.
    function onFullScreenChange(handler) {
      var attempts = 3,
          origWidth = window.innerWidth;

      document.body.onresize = function(e) {
        attempts--;
        if (attempts === 0 || window.innerWidth !== origWidth) {
          attempts = 0;
          document.body.onresize = null;
          handler(e);
        }
      };
    }

    //// SCOPE ////

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
      onFullScreenChange(flowerUtils.centerViz);
      scope.isFullscreen = !scope.isFullscreen;
    };
  }

});