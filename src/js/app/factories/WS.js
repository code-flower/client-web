/* global angular */
'use strict';

angular.module('CodeFlower')
.factory('WS', function(ORIGINS, MESSAGE_TYPES, $rootScope, state) {

  // initiates a clone on the backend,
  // monitors progress over a websockets connection,
  // and broadcasts to the subscribers

  return {

    cloneRepo: function(data, subscribers) {
      
      var socket = new WebSocket(ORIGINS.ws);

      socket.onopen = function(e) {
        socket.send(JSON.stringify({
          type: MESSAGE_TYPES.clone,
          repo: data
        }));  
      };

      socket.onmessage = function(event) {

        // halt if the clone has been aborted
        if (!state.cloning) {
          socket.send(JSON.stringify({
            type: MESSAGE_TYPES.abort
          }));
          return;
        }

        // otherwise handle the event
        var data = JSON.parse(event.data);
        var types = MESSAGE_TYPES;

        switch(data.type) {
          case types.text:
            subscribers.forEach(function(subscriber) {
              subscriber(data.text);
            });    
            break;
          case types.error:
            socket.close();
            $rootScope.$broadcast('cloneError');
            break;
          case types.credentials:
            socket.close();
            $rootScope.$broadcast('needCredentials', {
              needHTTPS: data.needHTTPS
            });
            break;
          case types.unauthorized:
            socket.close();
            $rootScope.$broadcast('needCredentials', { 
              invalid: true 
            });
            break;
          case types.complete:
            socket.close();
            $rootScope.$broadcast('cloneComplete', { 
              repoName: data.repoName
            });
            break;
        }
      };

      socket.onclose = function(e) {
        // console.log("WS connection closed");
      };

      socket.onerror = function(err) {
        console.error("WS connection error:", err);
      };
    }

  };
});
