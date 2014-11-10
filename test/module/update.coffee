Trip = require 'index'

describe 'update()', ->

  module = null

  before ->
    module = new Trip

  context 'with an invalid trip id', ->

    it 'returns an error object', (done) ->
      module.update 'foo', [], (err, trip) ->
        err.should.be.an.Object
        err.should.have.property 'message'
        err.should.have.property 'type'
        done()

  context 'with an invalid bookings array', ->

    it 'returns an error object', (done) ->
      module.update 'foo', 'foo', (err, trip) ->
        err.should.be.an.Object
        err.should.have.property 'message'
        err.should.have.property 'type'
        done()

  context 'with an unknown trip id', ->

    it 'returns an error object', (done) ->
      module.update '11111111-1111-1111-1111-111111111111', [], (err, trip) ->
        err.should.be.an.Object
        err.should.have.property 'message'
        err.should.have.property 'type'
        done()

  context 'with an existing trip id', ->

    existingTripId = null

    before (done) ->
      module.create 'test@test.com', [], (error, output) ->
        existingTripId = output.id
        done()

    it 'returns the updated trip', (done) ->
      module.update existingTripId, ['ABC123'], (err, trip) ->
        (err is null).should.be.true
        trip.should.be.an.Object
        trip.should.have.property 'bookings'
        trip.bookings.should.be.an.Array
        trip.bookings[0].should.equal 'ABC123'
        done()