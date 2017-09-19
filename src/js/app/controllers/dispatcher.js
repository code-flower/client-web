/* global angular */
'use strict';

angular.module('CodeFlower')
.controller('dispatcher', function(PARTIALS_DIR, MAX_NODES, $scope, $timeout, $uibModal, $q,
                                   $location, state, dataService, flowerUtils) {

  //// MODAL FUNCTIONS ////

  // see if the first path has more than MAX_NODES.
  // If so, prompt user to continue or render a subfolder.
  // Return the index of the folder in state.folderPaths that
  // should be rendered.
  function getCurrentPathIndex() {
    var deferred = $q.defer();

    var numNodes = state.folderPaths[0].totalNodes;
    if (numNodes > MAX_NODES) {
      $uibModal.open({
        controller: 'maxNodesModal',
        templateUrl: PARTIALS_DIR + 'modals/max-nodes-modal.html',
        animation: false,
        keyboard: false,
        size: 'sm',
        resolve: {
          params: {
            repoName: state.currentRepo.fullName,
            numNodes: numNodes
          }
        }
      }).result.then(function(data) {
        var curPathIdx = 0;

        // if we're rendering a subfolder, find the one
        // with the greatest number of nodes that's less
        // than or equal to MAX_NODES
        if (!data.renderAll) {
          var curMaxNodes = -1, nodes;
          for (var i = 1; i < state.folderPaths.length; i++) {
            nodes = state.folderPaths[i].totalNodes;
            if (nodes <= MAX_NODES && nodes > curMaxNodes) {
              curMaxNodes = nodes;
              curPathIdx = i;
            }
          }
        }

        $timeout(function() {
          deferred.resolve(curPathIdx)
        }, 500);
      });
    } else {
      deferred.resolve(0);
    }

    return deferred.promise;
  }

  function getCredentials(data) {
    $uibModal.open({

      controller: 'credentialsModal',
      templateUrl: PARTIALS_DIR + 'modals/credentials-modal.html',
      animation: false,
      size: 'sm',
      resolve: {
        data: data
      }

    }).result.then(function(res) {

      data.params.username = res.username;
      data.params.password = res.password;
      dataService.clone(data.params);

    }).catch(function(reason) {

      state.gitUrl = '';
      state.cloning = false;
      state.terminalOpen = false;

    });
  }

  //// OTHER PRIVATE FUNCTIONS ////

  function setSort(sortParams) {
    state.sortParams = sortParams;
    flowerUtils.sortLanguages(state.languages, sortParams);
  }

  function setFolder(folderPath) {
    var folder = flowerUtils.getFolder(state.currentRepo.cloc.tree, folderPath.pathName);
    state.currentFolder = {
      path: folderPath,
      data: folder
    };
    state.languages = flowerUtils.getLanguages(folder);
    setSort({
      sortCol: 'lines',
      sortDesc: true
    });
    flowerUtils.setLanguageColors(state.languages, state.colorScheme);
  }

  function buildUI(repoData) {
    state.currentRepo = repoData;
    state.folderPaths = flowerUtils.getFolderPaths(repoData.cloc.tree);

    getCurrentPathIndex()
    .then(function(curPathIdx) {
      setFolder(state.folderPaths[curPathIdx]);
    });
  }

  function setRepo(repoName) {
    dataService.harvest(repoName)
    .then(function(repoData) {
      buildUI(repoData);
    });
  }

  function deriveGitUrlFromRepo(repo) {
    return `https://github.com/${repo.owner}/${repo.name}.git`;
  }

  function doClone(data) {
    state.gitUrl = data.gitUrl || deriveGitUrlFromRepo(data.repo);
    state.cloning = true;
    state.terminalOpen = true;

    $timeout(function() {
      dataService.clone(data.repo);
    }, 500);
  }

  function handleNewRepo(repoData) {
    state.gitUrl = '';
    state.cloning = false;
    state.terminalOpen = false;

    var repoName= repoData.fullName;
    $timeout(function() {
      if (state.repoNames.indexOf(repoName) === -1) {
        state.repoNames.push(repoName);
        state.repoNames.sort();
      }
      buildUI(repoData);
    }, 500);
  }

  function deleteRepo(repoName) {
    var index = state.repoNames.indexOf(repoName);
    state.repoNames.splice(index, 1);

    dataService.delete(repoName)
    .then(function() {
      if (state.repoNames.length)
        setRepo(state.repoNames[index] || state.repoNames[0]);
    });
  }

  function removeLoader() {
    var mask = document.getElementsByClassName('loading-mask')[0];
    mask.parentNode.removeChild(mask);
  } 

  //// EVENT LISTENERS ////

  $scope.$on('doClone', function(e, data) {
    doClone(data);
  });

  $scope.$on('abortClone', function(e, data) {
    state.gitUrl = '';
    state.cloning = false;
    state.terminalOpen = false;
  });

  $scope.$on('needCredentials', function(e, data) {
    getCredentials(data);
  });

  $scope.$on('cloneComplete', function(e, data) {
    handleNewRepo(data);
  });

  $scope.$on('cloneError', function(e, data) {
    $timeout(function() { 
      state.cloning = false; 
    });
  });

  $scope.$on('switchRepo', function(e, repoName) {
    setRepo(repoName);
  });

  $scope.$on('deleteRepo', function(e, repoName) {
    deleteRepo(repoName);
  });

  $scope.$on('switchFolder', function(e, folderPath) {
    setFolder(folderPath);
  });

  $scope.$on('switchSort', function (e, sortParams) {
    setSort(sortParams);
  });

  $scope.$on('switchColorScheme', function(e, colorScheme) {
    state.colorScheme = colorScheme;
    setRepo(state.currentRepo.fullName);
  });

  $scope.$on('deleteDB', function(e, data) {
    dataService.deleteDB();
    location.reload();
  });

  $scope.$on('prefsChanged', function(e, data) {
    if (state.colorScheme !== data.prefs.colorScheme) {
      $timeout(function() {
        state.colorScheme = data.prefs.colorScheme;
        setRepo(state.currentRepo.fullName);
      }, 250);
    }
  });

  $scope.$on('flowerLoaded', function() {
    state.initialLoad = false;
  });

  //// STATE INITIALIZATION ////

  dataService.init()
  .then(dataService.enumerate)
  .then(function(repoNames) {
    removeLoader();
    state.repoNames = repoNames;

    var params = $location.search();
    if (params.owner && params.name)
      doClone({ repo: params });
    else if (repoNames[0])
      setRepo(repoNames[0]);
  });

});

