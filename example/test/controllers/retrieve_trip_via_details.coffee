restify = require 'restify'

#init the test client
client = restify.createJsonClient
  version: '*'
  url: 'http://127.0.0.1:3000'

describe 'GET /trip?ref=<ref>&email=<email>', ->

  describe 'input validation', ->

    context 'with invalid booking ref', ->

      it 'should return a bad request response code', (done) ->
        client.get '/trip?ref=---&email=foo@foo.com', (err, req, res, data) ->
          res.statusCode.should.be.equal 400
          done()

      it 'should return an object', (done) ->
        client.get '/trip?ref=---&email=foo@foo.com', (err, req, res, data) ->
          data.should.be.instanceof Object
          done()

      it 'should return a error message', (done) ->
        client.get '/trip?ref=---&email=foo@foo.com', (err, req, res, data) ->
          data.message.should.be.equal 'Invalid input'
          done()

    context 'with invalid email', ->

      it 'should return a bad request response code', (done) ->
        client.get '/trip?ref=ABC123&email=foo', (err, req, res, data) ->
          res.statusCode.should.be.equal 400
          done()

      it 'should return an object', (done) ->
        client.get '/trip?ref=ABC123&email=foo', (err, req, res, data) ->
          data.should.be.instanceof Object
          done()

      it 'should return a error message', (done) ->
        client.get '/trip?ref=ABC123&email=foo', (err, req, res, data) ->
          data.message.should.be.equal 'Invalid input'
          done()

  context 'with unknown booking ref', ->

    it 'should return a not found response code', (done) ->
      client.get '/trip?ref=doesnotexist&email=foo@foo.com', (err, req, res, data) ->
        res.statusCode.should.be.equal 404
        done()

    it 'should return an empty array', (done) ->
      client.get '/trip?ref=doesnotexist&email=foo@foo.com', (err, req, res, data) ->
        data.should.be.instanceof(Array).and.have.lengthOf 0
        done()
