restify = require 'restify'

#init the test client
client = restify.createJsonClient
  version: '*'
  url: 'http://127.0.0.1:3000'

describe 'GET /?ref=<ref>', ->

  context "unknown booking ref", ->

    it 'should return a not found response code', (done) ->
      client.get '/?ref=doesnotexist', (err, req, res, data) ->
        res.statusCode.should.be.equal 404
        done()

    it 'should return an empty array', (done) ->
      client.get '/?ref=doesnotexist', (err, req, res, data) ->
        data.should.be.instanceof(Array).and.have.lengthOf 0
        done()
