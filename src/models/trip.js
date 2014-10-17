//Trip model with convenience/business logic
var util = require('util');
var ModelBase = require('models/base');

var TripModel = function(dbModel){
  TripModel.super_.call(this, dbModel);
};

module.exports = TripModel;
util.inherits(TripModel, ModelBase);

var DbTrip = require('models/db/trip');
var uuid = require('node-uuid');
var logger = require('lib/logger');
var TripBookingModel = require('models/trip_booking');

//Returns unique database ID for instance
TripModel.prototype.id = function(){
  return this.__db.id;
};

//Update the model's data
TripModel.prototype.update = function(data, cb){
  var instance = this;
  DbTrip.update({id: instance.id()}, {$PUT: data}, function(err){
    if(err){
      logger.error(err);
      cb(err);
    }
    data.bookings.forEach(function(ref){
      logger.debug('adding index for: ' + ref);
      TripBookingModel.getById(ref, function(error, tripBooking){ //TODO deal with bookings removed from the trip
        if(err){
          logger.error(err);
          cb(err);
        }
        if(!tripBooking){
          logger.debug('creating new tripbooking for: ' + ref);
          //add to the booking index lookup
          tripBooking = TripBooking.create({
           ref: ref,
           tripId: instance.id()
          });
          tripBooking.save();
        }
      });
    });
    if(cb) cb();
  });
};

//Create new model in database
TripModel.create = function(data, cb){
  data.id = uuid.v1()
  var dbModel = new DbTrip(data);
  trip = new TripModel(dbModel);
  logger.debug("created trip");
  trip.save(function(err){
    if(err) return cb(err);
    logger.debug('saved trip');
    //create booking ref lookup if required
    data.bookings.forEach(function(booking){
      var tripBooking = TripBookingModel.create({
        ref: booking,
        tripId: trip.id()
      });
      tripBooking.save();
      logger.debug('saved tripbooking');
    });
    cb(null, trip);
  });
};

//Find model in database using given ID
TripModel.getById = function(id, cb){
  DbTrip.get({id: id}, function(err, trip){
    if(err){
      logger.error(err);
      cb(err);
    }
    if(trip){
      cb(null, new TripModel(trip));
    }
    else{
      cb();
    }
  });
};

//returns an array of trips
TripModel.findAll = function(cb){
  DbTrip.scan().exec(function(err, dbTrips, lastKey){
    var trips = dbTrips.map(function(dbTrip){
      return new TripModel(dbTrip);
    });
    cb(trips);
  });
};
