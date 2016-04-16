// this object is available both on the server (by requiring this file)
// and in the client (by being injected into the angular app in app.js)

module.exports = {

  hostName: process.env.NODE_ENV === 'production' ? 
            'machinemensch.dynu.com' : 
            'localhost',

  ports: {
    HTTP: 8000,
    WS: 8001,
    browserSyncUI: 8090
  },

  paths: {
    client:   `${__dirname}/../client/`,
    server:   `${__dirname}/../server/`,
    repos:    `${__dirname}/../server/system/repos/`,
    samples:  `${__dirname}/../server/system/samples/`,
    partials: 'app/partials/'
  },

  //// HTTP ////
  endpoints: {
    harvest: '/harvest',
    samples: '/samples'
  },

  //// WS ////
  messageTypes: {
    // from client to server
    clone: 'clone',
    abort: 'abort',
    // from server to client
    text: 'text',
    error: 'error',
    credentials: 'credentials',
    unauthorized: 'unauthorized',
    complete: 'complete'
  },

  //// CLIENT-SIDE DB ////
  database: {
    dbName: 'repos',
    tableName: 'repoTable'
  },

  //// REPONAME/FOLDERNAME CONVERSION ////
  repoToFolder: function(repoName) {
    return repoName.replace('/', '#');
  },

  folderToRepo: function(folderName) {
    return folderName.replace('#', '/');
  },

  //// MISC ////
  colorSchemes: require('./colorSchemes'),

  defaultPrefs: {
    colorScheme: 'periwinkle'
  },

  deleteAfterClone: true

};
