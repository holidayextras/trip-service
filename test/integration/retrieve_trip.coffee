restify = require 'restify'

#init the test client
client = restify.createJsonClient
  version: '*'
  url: 'http://127.0.0.1:3000'

describe 'GET /<uuid>', ->

  context "unknown trip id", ->

    it 'should return a not found response code', (done) ->
      client.get '/abc', (err, req, res, data) ->
        res.statusCode.should.be.equal 404
        done()

    it 'should return an empty object', (done) ->
      client.get '/abc', (err, req, res, data) ->
        data.should.be.instanceof(Object).and.be.empty
        done()
