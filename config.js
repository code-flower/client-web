
module.exports = {

  // SERVER LOCATIONS
  // origins: {
  //   harvest: 'https://codeflower.la:8000',
  //   email:   'https://codeflower.la:8000', 
  //   samples: '/',
  //   ws:      'wss://codeflower.la:8000'
  // },

  origins: {
    harvest: 'http://localhost:8000',
    email:   'http://localhost:8000',
    samples: '',
    ws:      'ws://localhost:8000'
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
    partials: 'app/partials/'
  },

  //// CLIENT-SIDE DB ////
  database: {
    dbName: 'repos',
    tableName: 'repoTable'
  },

  maxNodes: 1000

};