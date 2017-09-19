/* global angular */
'use strict';

angular.module('CodeFlower')
.controller('credentialsModal', function($scope, data) {

  //// SCOPE VARIABLES ////

  $scope.username = '';
  $scope.password = '';
  $scope.fullName = data.params.owner + '/' + data.params.name;
  $scope.invalid = data.invalid;

  //// SCOPE FUNCTIONS ////

  $scope.clone = function() {
    $scope.$close({
      username: $scope.username,
      password: $scope.password
    });
  };

  $scope.abort = $scope.$dismiss;

});