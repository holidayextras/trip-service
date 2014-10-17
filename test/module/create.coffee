Trip = require 'index'

describe 'create()', ->

  module = null

  before ->
    module = new Trip

  context 'with invalid email', ->

    it 'returns an error', (done) ->
      module.create 'notanemail', [], (error, output) ->
        error.should.be.an.Object
        error.should.have.property 'message'
        error.should.have.property 'type'
        done()

  context 'with invalid bookings', ->

    it 'returns an error if given a string', (done) ->
      module.create 'test@test.com', 'foo', (error, output) ->
        error.should.be.an.Object
        error.should.have.property 'message'
        error.should.have.property 'type'
        done()

    it 'returns an error if given an object', (done) ->
      module.create 'test@test.com', {}, (error, output) ->
        error.should.be.an.Object
        error.should.have.property 'message'
        error.should.have.property 'type'
        done()

  context 'with no bookings', ->

    it 'returns trip data', (done) ->
      module.create 'test@test.com', null, (error, output) ->
        (error is null).should.be.true
        output.should.be.an.Object
        output.should.have.property 'id'
        output.should.have.property 'bookings'
        output.bookings.should.be.an.Object.with.lengthOf 0
        done()

  context 'with bookings', ->

    it 'returns trip data', (done) ->
      module.create 'test@test.com', ['abc123'], (error, output) ->
        (error is null).should.be.true
        output.should.be.an.Object
        output.should.have.property 'id'
        output.should.have.property 'bookings'
        output.bookings.should.be.an.Object.with.lengthOf 1
        done()
