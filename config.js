
module.exports = {

  api: {
    origin: process.env.REMOTE_API ? 
            'wss://api.codeflower.la' : 
            'wss://localhost:8000',
    endpoints: {
      cloc: 'cloc'
    },
    responseTypes: {
      success: 'success',
      error:   'error',
      update:  'update'
    },
    errorNames: {
      ParseError:             'ParseError',
      EndpointNotRecognized:  'EndpointNotRecognized',
      MethodNotAllowed:       'MethodNotAllowed',
      NeedOwnerAndName:       'NeedOwnerAndName',
      NeedCredentials:        'NeedCredentials',
      CredentialsInvalid:     'CredentialsInvalid',
      RepoNotFound:           'RepoNotFound',
      BranchNotFound:         'BranchNotFound'
    }
  },

  paths: {
    partials: 'app/partials/',
    SSL: {
      key:  '../sslCert/privkey.pem',
      cert: '../sslCert/cert.pem'
    }
  },

  database: {
    dbName: 'repos',
    tableName: 'repoTable'
  },

  maxNodes: 1000,

  s3: {
    bucket: 'codeflower-client-web'
  }

};
