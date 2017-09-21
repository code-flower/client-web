/* global angular */
'use strict';

angular.module('CodeFlower')
.directive('ignoredFiles', function(PARTIALS_DIR, FEATURES, state, dataService, $sce) {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: PARTIALS_DIR + 'modals/ignored-files.html',
    scope: {},
    link: link
  };

  function link(scope, el, attrs) {

    //// PRIVATE ////

    function displayIgnored(ignored) {
      var formatted = ('&bull; ' + ignored)
                      .replace(/\n/g, '<br/> &bull; ')
                      .replace(/&bull;\s$/, '');

      return $sce.trustAsHtml(formatted);
    }

    //// SCOPE VARS ////

    scope.repoNames = state.repoNames;
    scope.selectedRepo = state.currentRepo && state.currentRepo.fullName;
    scope.ignoredText = '';
    scope.multipleRepos = FEATURES.multipleRepos;

    //// SCOPE FUNCTIONS ////

    scope.displayIgnored = function(repoName) {
      dataService.getIgnored(repoName)
      .then(function(ignored) {
        scope.ignoredText = displayIgnored(ignored);
      });
    };

    //// INITIALIZATION ////

    scope.displayIgnored(scope.selectedRepo);
  }

});
