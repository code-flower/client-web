// get the config file
var config = require('../../../config.js');

// inject config into angular app
angular.module('CodeFlower', ['ui.bootstrap'])
  .constant('ORIGINS', config.origins)
  .constant('ENDPOINTS', config.endpoints)
  .constant('MESSAGE_TYPES', config.messageTypes)
  .constant('PARTIALS_DIR', config.paths.partials)
  .constant('DATABASE', config.database)
  .constant('MAX_NODES', config.maxNodes)
  .config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }]);