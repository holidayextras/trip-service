//Trip model with convenience/business logic
var DbTrip = require('models/db/trip');
var uuid = require('node-uuid');
var logger = require('lib/logger');
var util = require('util');
var ModelBase = require('models/base');
var TripBooking = require('models/trip_booking');

var TripModel = function(dbModel){
  TripModel.super_.call(this, dbModel);
};

util.inherits(TripModel, ModelBase);

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
      TripBooking.getById(ref, function(error, tripBooking){ //TODO deal with bookings removed from the trip
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
          console.log(tripBooking);
          tripBooking.save();
        }
      });
    });
    if(cb) cb();
  });
};

//Create new model in database
TripModel.create = function(data){
  data.id = uuid.v1()
  var dbModel = new DbTrip(data);
  return new TripModel(dbModel);
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

module.exports = TripModel;