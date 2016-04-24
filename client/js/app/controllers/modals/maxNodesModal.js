/* global angular */
'use strict';

angular.module('CodeFlower')
.controller('maxNodesModal', function($scope, appConfig, params) {

  console.log("inside maxNodes Modal:", $scope, params);

  //// SCOPE VARIABLES ////

  $scope.repoName = params.repoName;
  $scope.numNodes = params.numNodes;

  //// SCOPE FUNCTIONS ////

  $scope.closeModal = function(renderAll) {
    $scope.$close({
      renderAll: renderAll
    });
  };

});