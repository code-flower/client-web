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
    scope.isFullscreen = false;

    scope.openModal = function() {
      $uibModal.open({
        controller: 'mainModal',
        templateUrl: PARTIALS_DIR + 'modals/main-modal.html',
        animation: false
      });
    };

    scope.toggleFullscreen = function() {
      var app = document.getElementsByClassName('app-container')[0];

      if (!scope.isFullscreen) {
        if (app.mozRequestFullScreen)
          app.mozRequestFullScreen();
        else
          app.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        scope.isFullscreen = true;
      } else {
        if (document.mozCancelFullScreen)
          document.mozCancelFullScreen();
        else
          document.webkitExitFullscreen();
        scope.isFullscreen = false;
      }
    };

    // for testing modal
    // setTimeout(function() {
    //    scope.openPrefs();
    // }, 500);
  }

});