// get the config file
var config = require('../../../config.js');

// inject config into angular app
angular.module('CodeFlower', ['ui.bootstrap', 'FBAngular'])
  .constant('API', config.api)
  .constant('PARTIALS_DIR', config.paths.partials)
  .constant('DATABASE', config.database)
  .constant('MAX_NODES', config.maxNodes)
  .value('FEATURES', {
    multipleRepos: true
  })
  .config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }])
  .run(['$location', 'FEATURES', function($location, FEATURES) {
    if ($location.search().context === 'chrome')
      FEATURES.multipleRepos = false;
  }]);