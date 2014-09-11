#global before hook to start server prior to tests
before (done) ->
  require('../../lib/server').Server()
  done()
