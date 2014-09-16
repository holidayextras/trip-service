var DbTrip = require('models/db/trip');
var uuid = require('node-uuid');
var logger = require('lib/logger');
var util = require('util');
var ModelBase = require('models/base');
var TripBooking = require('models/trip_booking');

var Trip = function(dbModel){
  Trip.super_.call(this, dbModel);
};

util.inherits(Trip, ModelBase);

Trip.prototype.id = function(){
  return this.__db.id;
};

Trip.prototype.update = function(data, cb){
  var instance = this;
  DbTrip.update({id: instance.id()}, {$PUT: data}, function(err){
    if(err) return logger.error(err);
    data.bookings.forEach(function(ref){
      logger.debug('adding index for: ' + ref);
      TripBooking.getById(ref, undefined, function(){ //TODO deal with bookings removed from the trip
        logger.debug('creating new tripbooking for: ' + ref);
        //add to the booking index lookup
        tripBooking = TripBooking.create({
         ref: ref,
         tripId: instance.id()
        });
        console.log(tripBooking);
        tripBooking.save();
      });
    });
    if(cb) cb();
  });
};

Trip.create = function(data){
  data.id = uuid.v1()
  var dbModel = new DbTrip(data);
  return new Trip(dbModel);
};

Trip.getById = function(id, found, notFound){
  DbTrip.get({id: id}, function(err, trip){
    if(err) return logger.error(err);
    if(trip){
      if(found) found(new Trip(trip));
    }
    else{
      if(notFound) notFound();
    }
  });
};

//returns an array of trips
Trip.findAll = function(cb){
  DbTrip.scan().exec(function(err, dbTrips, lastKey){
    var trips = dbTrips.map(function(dbTrip){
      return new Trip(dbTrip);
    });
    cb(trips);
  });
};

module.exports = Trip;