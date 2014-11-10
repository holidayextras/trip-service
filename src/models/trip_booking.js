//Trip booking model with convenience/business logic
var ModelBase = require('./base');
var util = require('util');

var TripBookingModel = function(dbModel){
  TripBookingModel.super_.call(this, dbModel);
};

module.exports = TripBookingModel;

util.inherits(TripBookingModel, ModelBase);

var TripModel = require('./trip');
var DbTripBooking = require('./db/trip_booking');
var logger = require('../lib/logger');

//Return models unique ID in database
TripBookingModel.prototype.id = function(){
  return this.__db.ref;
}

TripBookingModel.prototype.getTrip = function(cb){
  TripModel.getById(this._tripId(), function(err, trip){
    if(err) return cb(err);
    cb(null, trip);
  });
};

//Create new model
TripBookingModel.create = function(data){
  var dbModel = new DbTripBooking(data);
  return new TripBookingModel(dbModel);
};

//Lookup model by ID in database
TripBookingModel.getById = function(id, cb){
  DbTripBooking.get({ref: id}, function(err, tripBooking){
    if(err){
      logger.error(err);
      return cb(err);
    }
    if(!tripBooking) return cb();
    cb(null, new TripBookingModel(tripBooking));
  });
};

TripBookingModel.prototype._tripId = function(){
  return this.__db.tripId;
}
