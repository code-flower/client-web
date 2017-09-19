/* global angular */
'use strict';

angular.module('CodeFlower')
.directive('flowerControl', function(PARTIALS_DIR, MAX_NODES, state, colorSchemes) {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: PARTIALS_DIR + 'flower-control.html',
    scope: {},
    link: link
  };

  function link(scope, el, attrs) {

    //// PRIVATE FUNCTIONS ////

    function extractRepoFromGitUrl(url) {
      var match = url.match(/([^:\/]*?)\/([^\/]*?)\.git$/);
      if (match && match[1] && match[2])
        return {
          owner: match[1],
          name: match[2]
        };
      else
        return null;
    }

    //// SCOPE VARIABLES ////

    scope.state = state;
    scope.gitUrl = '';
    scope.selectedRepo = '';
    scope.selectedFolder = {};
    scope.selectedColorScheme = '';
    scope.colorSchemes = Object.keys(colorSchemes);
    scope.maxNodes = MAX_NODES;

    //// EVENT EMITTERS ////

    scope.doClone = function(gitUrl) {
      var repo = extractRepoFromGitUrl(gitUrl);
      if (repo) {
        scope.$emit('doClone', {
          repo: repo, 
          gitUrl: gitUrl
        });
      } else {
        console.log('Not a valid git clone url. Need a modal for this.')
        scope.gitUrl = '';
      }
    };

    scope.abortClone = function() {
      scope.$emit('abortClone');
    };

    scope.switchRepo = function(repoName) {
      if (repoName)
        scope.$emit('switchRepo', repoName);
    };

    scope.deleteRepo = function(repoName) {
      scope.$emit('deleteRepo', repoName);
    };

    scope.switchFolder = function(folderPath) {
      for (var i = 0; i < state.folderPaths.length; i++) {
        if (state.folderPaths[i].pathName === folderPath) {
          scope.$emit('switchFolder', state.folderPaths[i]);
          break;
        }
      }
    };

    scope.switchColorScheme = function(colorScheme) {
      scope.$emit('switchColorScheme', colorScheme);
    };

    //// WATCHERS ////

    scope.$watch('state.gitUrl', function(newVal, oldVal) {
      scope.gitUrl = newVal;
    });

    scope.$watch('state.currentRepo.name', function(newVal, oldVal) {
      scope.selectedRepo = newVal;
    });

    scope.$watch('state.currentFolder.path', function(newVal, oldVal) {
      scope.selectedFolder = newVal.pathName;
    });

    scope.$watch('state.colorScheme', function(newVal, oldVal) {
      scope.selectedColorScheme = newVal;
    });
  }

});
