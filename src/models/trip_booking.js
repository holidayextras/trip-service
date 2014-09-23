//Trip booking model with convenience/business logic
var DbTripBooking = require('models/db/trip_booking');
var logger = require('lib/logger');
var util = require('util');
var ModelBase = require('models/base');

var TripBookingModel = function(dbModel){
  TripBookingModel.super_.call(this, dbModel);
};

util.inherits(TripBookingModel, ModelBase);

//Return models unique ID in database
TripBookingModel.prototype.id = function(){
  return this.__db.ref;
}

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

module.exports = TripBookingModel;
