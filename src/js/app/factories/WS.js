/* global angular */
'use strict';

angular.module('CodeFlower')
.factory('WS', function(API, $rootScope, state) {

  // initiates a clone on the backend,
  // monitors progress over a websockets connection,
  // and broadcasts to the subscribers

  return {

    cloneRepo: function(repo, subscribers, onSuccess) {
      
      var socket = new WebSocket(API.origin);

      socket.onopen = function(e) {
        socket.send(JSON.stringify({
          endpoint: API.endpoints.cloc,
          params: repo
        }));  
      };

      socket.onmessage = function(event) {

        // halt if the clone has been aborted
        if (!state.cloning) {
          socket.close();
          return;
        }

        // otherwise handle the event
        var message = JSON.parse(event.data);
        var types = API.responseTypes;

        switch(message.type) {
          case types.update:
            subscribers.forEach(function(subscriber) {
              subscriber(message.data.text);
            });
            break;

          case types.success: 
            onSuccess(message.data);
            $rootScope.$broadcast('cloneComplete', message.data);
            break;

          case types.error:
            var errNames = API.errorNames;

            switch(message.data.name) {
              case errNames.NeedCredentials:
                $rootScope.$broadcast('needCredentials', {
                  params: message.data.params
                });
                break;
              case errNames.CredentialsInvalid:
                $rootScope.$broadcast('needCredentials', {
                  params: message.data.params,
                  invalid: true
                });
                break;
              default:
                console.log('Unhandled error:', message.data);
                $rootScope.$broadcast('cloneError', message.data);
                break;
            }

            break;
        }
      };

      socket.onclose = function(e) {
        //console.log('WS connection closed');
      };

      socket.onerror = function(err) {
        console.error('WS connection error:', err);
      };
    }

  };
});
