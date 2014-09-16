restify = require 'restify'

#init the test client
client = restify.createJsonClient
  version: '*'
  url: 'http://localhost:3000'

describe 'POST /trip', ->

  params = null

  describe 'input validation', ->

    context 'with an invalid email', ->

      beforeEach ->
        params = 
          email: 'notvalid'

      it 'should return a bad request response code', (done) ->
        client.post '/trip', params, (err, req, res, data) ->
          res.statusCode.should.be.equal 400
          done()

      it 'should return an object', (done) ->
        client.post '/trip', params, (err, req, res, data) ->
          data.should.be.instanceof Object
          done()

      it 'should return a error message', (done) ->
        client.post '/trip', params, (err, req, res, data) ->
          data.message.should.be.equal 'Invalid input'
          done()

    context 'with no email', ->

      beforeEach ->
        params = {}

      it 'should return a bad request response code', (done) ->
        client.post '/trip', params, (err, req, res, data) ->
          res.statusCode.should.be.equal 400
          done()

      it 'should return an object', (done) ->
        client.post '/trip', params, (err, req, res, data) ->
          data.should.be.instanceof Object
          done()

      it 'should return a error message', (done) ->
        client.post '/trip', params, (err, req, res, data) ->
          data.message.should.be.equal 'Invalid input'
          done()

    context 'with invalid bookings', ->

      beforeEach ->
        params =
          email: 'test@test.com'
          bookings: 'foo'

      it 'should return a bad request response code', (done) ->
        client.post '/trip', params, (err, req, res, data) ->
          res.statusCode.should.be.equal 400
          done()

      it 'should return an object', (done) ->
        client.post '/trip', params, (err, req, res, data) ->
          data.should.be.instanceof Object
          done()

      it 'should return a error message', (done) ->
        client.post '/trip', params, (err, req, res, data) ->
          data.message.should.be.equal 'Invalid input'
          done()

  context 'with no bookings', ->

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

  context 'with multiple bookings', ->

    beforeEach ->
      params =
        bookings: ['foo', 'bar']
        email: 'test@holidayextras.co.uk'

    it 'should return a trip with two bookings', (done) ->
      client.post '/trip', params, (err, req, res, data) ->
        data.bookings.should.be.instanceof(Array).and.have.lengthOf 2
        done()
