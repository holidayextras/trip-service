restify = require 'restify'

#init the test client
client = restify.createJsonClient
  version: '*'
  url: 'http://127.0.0.1:3000'

describe 'GET /', ->

  it 'should return a successful response code', (done) ->
    client.get '/', (err, req, res, data) ->
      res.statusCode.should.be.equal 200
      done()

  it 'should return an array', (done) ->
    client.get '/', (err, req, res, data) ->
      data.should.be.instanceof Array
      done()
