Trip = require 'index'

describe 'find()', ->

  module = null

  before ->
    module = new Trip

  context 'with invalid email', ->

    it 'returns and error object', (done) ->
      module.find 'notanemail', 'ABC123', (error, output) ->
        error.should.be.an.Object
        error.should.have.property 'message'
        error.should.have.property 'type'
        done()

  context 'with invalid booking ref', ->

    it 'returns and error object', (done) ->
      module.find 'test@test.com', '----', (error, output) ->
        error.should.be.an.Object
        error.should.have.property 'message'
        error.should.have.property 'type'
        done()

  context 'with an unknown booking ref', ->

    it 'returns neither an error or any output', (done) ->
      module.find 'test@test.com', 'FOO123', (error, output) ->
        (typeof error).should.equal 'undefined'
        (typeof output).should.equal 'undefined'
        done()

  context 'with known booking ref', ->

    knownRef = 'AAA123'

    before (done) ->
      module.create 'test@test.com', [knownRef], (error, output) ->
        done()

    it 'returns output of the trip', (done) ->
      module.find 'test@test.com', knownRef, (error, output) ->
        (error is null).should.be.true
        output.should.be.an.Object
        output.should.have.property 'id'
        output.should.have.property 'bookings'
        done()
