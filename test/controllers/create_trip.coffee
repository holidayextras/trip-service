restify = require 'restify'

#init the test client
client = restify.createJsonClient
  version: '*'
  url: 'http://localhost:3000'

describe 'POST /trip', ->

  params = null

  context "with no bookings", ->

    beforeEach ->
      params = 
        email: 'test@holidayextras.co.uk'

    it 'should return a created response code', (done) ->
      client.post '/trip', params, (err, req, res, data) ->
        res.statusCode.should.be.equal 201
        done()

    it 'should return a trip with no bookings', (done) ->
      client.post '/trip', params, (err, req, res, data) ->
        data.bookings.should.be.instanceof(Array).and.have.lengthOf 0
        done()

  context "with multiple bookings", ->

    beforeEach ->
      params =
        bookings: ['foo', 'bar'],
        email: 'test@holidayextras.co.uk'

    it 'should return a trip with two bookings', (done) ->
      client.post '/trip', params, (err, req, res, data) ->
        data.bookings.should.be.instanceof(Array).and.have.lengthOf 2
        done()

  context "with no email", ->

    beforeEach ->
      params = {}

    it 'should return a server error response code', (done) ->
      client.post '/trip', params, (err, req, res, data) ->
        res.statusCode.should.be.equal 500
        done()

    it 'should return the correct error message', (done) ->
      client.post '/trip', params, (err, req, res, data) ->
        data.message.should.eql 'Requried value missing: email'
        done()
