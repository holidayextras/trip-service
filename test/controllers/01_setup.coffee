#global before hook to start server prior to tests
before (done) ->
  require('lib/server')() unless process.env.NO_TEST_SERVER
  done()
