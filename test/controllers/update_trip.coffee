restify = require 'restify'

#init the test client
client = restify.createJsonClient
  version: '*'
  url: 'http://127.0.0.1:3000'

describe 'PUT /trip/<uuid>', ->

  params = null;

  describe 'input validation', ->

    context 'with an invalid trip id', ->

      beforeEach ->
        params =
          bookings: ['ABC123']

      it 'should return a bad request response code', (done) ->
        client.put '/trip/foo', params, (err, req, res, data) ->
          res.statusCode.should.be.equal 400
          done()

      it 'should return an object', (done) ->
        client.put '/trip/foo', params, (err, req, res, data) ->
          data.should.be.instanceof Object
          done()

      it 'should return a error message', (done) ->
        client.put '/trip/foo', params, (err, req, res, data) ->
          data.message.should.be.equal 'Invalid input'
          done()

    context 'with invalid bookings', ->

      beforeEach ->
        params =
          bookings: 'foo'

      it 'should return a bad request response code', (done) ->
        client.put '/trip/11111111-1111-1111-1111-111111111111', params, (err, req, res, data) ->
          res.statusCode.should.be.equal 400
          done()

      it 'should return an object', (done) ->
        client.put '/trip/11111111-1111-1111-1111-111111111111', params, (err, req, res, data) ->
          data.should.be.instanceof Object
          done()

      it 'should return a error message', (done) ->
        client.put '/trip/11111111-1111-1111-1111-111111111111', params, (err, req, res, data) ->
          data.message.should.be.equal 'Invalid input'
          done()

  context 'with a unknown trip id', ->

    beforeEach ->
      params =
        bookings: ['ABC123']

    it 'should return a not found response code', (done) ->
      client.put '/trip/11111111-1111-1111-1111-111111111111', params, (err, req, res, data) ->
        res.statusCode.should.be.equal 404
        done()

  context 'with an existing trip id', ->

    existingTripId = null

    before (done) ->
      #create a trip first so that we have a valid trip id

      createParams =
        email: 'test@test.com'
        bookings: ['ABC123']

      client.post '/trip', createParams, (err, req, res, data) ->
        existingTripId = data.id
        done()

    beforeEach ->
      params =
        bookings: ['CDE123', 'FGH123']

    it 'should return a success response code', (done) ->
      client.put '/trip/' + existingTripId, params, (err, req, res, data) ->
        res.statusCode.should.be.equal 200
        done()

    it 'should return an updated bookings list', (done) ->
      client.put '/trip/' + existingTripId, params, (err, req, res, data) ->
        data.bookings.should.be.instanceof(Array).and.have.lengthOf 2
        done()
