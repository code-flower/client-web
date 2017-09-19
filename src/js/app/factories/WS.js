/* global angular */
'use strict';

angular.module('CodeFlower')
.factory('WS', function(API, $q, state) {

  // initiates a clone on the backend,
  // monitors progress over a websockets connection,
  // and broadcasts to the subscribers

  return {
    cloneRepo: function(repo) {
      
      var deferred = $q.defer(),
          socket = new WebSocket(API.origin);

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
          deferred.reject('Clone aborted');
        }

        // otherwise handle the event
        var message = JSON.parse(event.data);
        var types = API.responseTypes;

        var deferFunc = (function() {
          switch(message.type) {
            case types.update:  return deferred.notify;
            case types.success: return deferred.resolve;
            case types.error:   return deferred.reject;
          }
        })();

        deferFunc(message.data);
      };

      socket.onclose = function(e) {
        //console.log('WS connection closed');
      };

      socket.onerror = function(err) {
        console.error('WS connection error:', err);
        deferred.reject(err);
      };

      return deferred.promise;
    }
  };
});
