restify = require 'restify'

#init the test client
client = restify.createJsonClient
  version: '*'
  url: 'http://127.0.0.1:3000'

describe 'GET /trip/<uuid>', ->

  describe 'input validation', ->

    context 'invalid trip id', ->

      it 'should return a bad request response code', (done) ->
        client.get '/trip/foo', (err, req, res, data) ->
          res.statusCode.should.be.equal 400
          done()

      it 'should return an object', (done) ->
        client.get '/trip/foo', (err, req, res, data) ->
          data.should.be.instanceof Object
          done()

      it 'should return a error message', (done) ->
        client.get '/trip/foo', (err, req, res, data) ->
          data.message.should.be.equal 'Invalid input'
          done()

  context 'with unknown trip id', ->

    it 'should return a not found response code', (done) ->
      client.get '/trip/11111111-1111-1111-1111-111111111111', (err, req, res, data) ->
        res.statusCode.should.be.equal 404
        done()

    it 'should return an empty object', (done) ->
      client.get '/trip/11111111-1111-1111-1111-111111111111', (err, req, res, data) ->
        data.should.be.instanceof(Object).and.be.empty
        done()
