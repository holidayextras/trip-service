restify = require 'restify'

#init the test client
client = restify.createJsonClient
  version: '*'
  url: 'http://localhost:3000'

describe 'POST /', ->

  context "with no bookings", ->

    it 'should return a created response code', (done) ->
      client.post '/', {}, (err, req, res, data) ->
        res.statusCode.should.be.equal 201
        done()

    it 'should return a trip with no bookings', (done) ->
      client.post '/', {}, (err, req, res, data) ->
        data.bookings.should.be.instanceof(Array).and.have.lengthOf 0
        done()

  context "with multiple bookings", ->

    params = null

    beforeEach ->
      params = 
        bookings: ['foo', 'bar']

    it 'should return a trip with two bookings', (done) ->
      client.post '/', params, (err, req, res, data) ->
        data.bookings.should.be.instanceof(Array).and.have.lengthOf 2
        done()
