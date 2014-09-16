var DbTripBooking = require('models/db/trip_booking');
var logger = require('lib/logger');
var util = require('util');
var ModelBase = require('models/base');

var TripBooking = function(dbModel){
  TripBooking.super_.call(this, dbModel);
};

util.inherits(TripBooking, ModelBase);

TripBooking.prototype.id = function(){
  return this.__db.ref;
}

TripBooking.create = function(data){
  var dbModel = new DbTripBooking(data);
  return new TripBooking(dbModel);
};

TripBooking.getById = function(id, found, notFound){
  DbTripBooking.get({ref: id}, function(err, tripBooking){
    if(err) return logger.error(err);
    if(tripBooking){
      if(found) found(new TripBooking(tripBooking));
    }
    else{
      if(notFound) notFound();
    }
  });
};

module.exports = TripBooking;
