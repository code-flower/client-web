/* global angular */
'use strict';

angular.module('CodeFlower')
.controller('mainModal', function(PARTIALS_DIR, FEATURES, $scope) {

  //// SCOPE VARS ////

  $scope.activeTab = 'about';
  $scope.aboutTabPartial = PARTIALS_DIR + 'modals/about-section.html';
  $scope.multipleRepos = FEATURES.multipleRepos;

  //// SCOPE FUNCTIONS ////

  $scope.setTab = function(tab) {
    $scope.activeTab = tab;
  };

  $scope.closeModal = $scope.$close;

});