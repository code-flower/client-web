/* global angular */
'use strict';

angular.module('CodeFlower')
.controller('mainModal', function(PARTIALS_DIR, $scope) {

  //// SCOPE VARS ////

  $scope.activeTab = 'about';
  $scope.aboutTabPartial = PARTIALS_DIR + 'modals/about-section.html';

  //// SCOPE FUNCTIONS ////

  $scope.setTab = function(tab) {
    $scope.activeTab = tab;
  };

  $scope.closeModal = $scope.$close;

});