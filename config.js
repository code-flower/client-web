
module.exports = {

  // SERVER LOCATIONS
  origins: {
    harvest: 'https://localhost:8000',
    email:   'https://localhost:8000',
    samples: '',
    ws:      'wss://localhost:8000'
  },

  //// HTTP ////
  endpoints: {
    harvest: '/harvest',
    email:   '/email',
    samples: '/data/samples.json'
  }, 

  //// WS ////
  messageTypes: {
    // from client to server
    clone:        'clone',
    abort:        'abort',
    // from server to client
    text:         'text',
    error:        'error',
    credentials:  'credentials',
    unauthorized: 'unauthorized',
    complete:     'complete'
  },

  paths: {
    partials: 'app/partials/',
    SSL: {
      key:  '../devSSL/cert/server.key',
      cert: '../devSSL/cert/server.crt'
    } 
  },

  //// CLIENT-SIDE DB ////
  database: {
    dbName: 'repos',
    tableName: 'repoTable'
  },

  maxNodes: 1000

};
