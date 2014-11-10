Trip = require 'index'

describe 'show()', ->

  module = null

  before ->
    module = new Trip

  context 'with an invalid trip id', ->

    it 'returns an error object', (done) ->
      module.show 'foo', (err, trip) ->
        err.should.be.an.Object
        err.should.have.property 'message'
        err.should.have.property 'type'
        done()

  context 'with an unknown trip id', ->

    it 'does not return a trip or error', (done) ->
      module.show '11111111-1111-1111-1111-111111111111', (err, trip) ->
        (err is undefined).should.be.true
        (trip is undefined).should.be.true
        done()

  context 'with an existing trip id', ->

    existingTripId = null

    before (done) ->
      module.create 'test@test.com', [], (error, output) ->
        existingTripId = output.id
        done()

    it 'returns the trip', (done) ->
      module.show existingTripId, (err, trip) ->
        (err is null).should.be.true
        trip.should.be.an.Object
        done()
