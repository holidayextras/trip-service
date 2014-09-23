var TripModel = require('models/trip');
var TripBookingModel = require('models/trip_booking');
var iz = require('iz');
var logger = require('lib/logger');
var SimpleDataPresenter = require('presenters/simple_data');

var Trip = function(){
  this.logger = logger;
};

Trip.prototype.find = function(email, ref, cb){
  if(iz(email).required().string().email().valid && iz(ref).required().string().alphaNumeric().valid){
    var instance = this;
    TripBookingModel.getById(ref, function(err, tripBooking){
      if(err) return cb(err);
      if(!tripBooking) return cb();
      TripModel.getById(tripBooking.id(), function(trip){
        //TODO check for email address of trip here
        var output = new SimpleDataPresenter(trip).transform();
        cb(null, output);
      });
    });
  }
  else{
    this.logger.error({
      input: {
        ref: ref,
        email: email
      }
    }, 'Invalid input');
    cb({message: 'Invalid input'});
  }
};

Trip.prototype.create = function(email, bookings, cb){
  if(iz(email).required().string().email().valid && iz(bookings).anArray().valid){
    this.logger.debug("input ok");
    var bookings = bookings || [];
    var email = email;
    var trip = TripModel.create({
      bookings: bookings,
      email: email
    });
    this.logger.debug("created trip");
    var instance = this;
    trip.save(function(){
      instance.logger.debug('saved trip');
      //create booking ref lookup if required
      bookings.forEach(function(booking){
        var tripBooking = TripBookingModel.create({
          ref: booking,
          tripId: trip.id()
        });
        tripBooking.save();
        instance.logger.debug('saved tripbooking');
      });
      cb(null, new SimpleDataPresenter(trip).transform());
    });
  }
  else{
    this.logger.error({
      input: {
        email: email,
        bookings: bookings
      }
    }, 'Invalid input');
    cb({message: 'Invalid input'});
  }
};

Trip.prototype.update = function(id, bookings, cb){
  this.logger.debug("in update");
  if(iz(id).required().string().valid && /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/i.test(id) && iz(bookings).required().anArray().valid){
    this.logger.debug("input ok");
    var instance = this;
    TripModel.getById(id, function(error, trip){
      if(error) return cb(error);
      if(!trip){
        instance.logger.debug('trip not found');
        return cb({message: 'trip not found'});
      }
      //update the trip with the new booking
      instance.logger.debug('found trip');
      instance.logger.debug({bookings: bookings});
      sentBookings = bookings || [];
      trip.update({bookings: sentBookings}, function(error){
        if(error) return cb(error);
        //get the updated trip data
        TripModel.getById(trip.id(), function(error, model){
          if(error) return cb(error);
          if(!model){
            instance.logger.debug('trip not found');
            return cb({message: 'trip not found'});
          }
          cb(null, new SimpleDataPresenter(model).transform());
        });
      });
    });
  }
  else{
    this.logger.error({
      input: {
        id: id,
        bookings: bookings
      }
    }, "Invalid input");
    cb({message: "Invalid input"});
  }
};

Trip.prototype.show = function(id, cb){
  if(iz(id).required().string().valid && /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/i.test(id)){
    TripModel.getById(id, function(error, trip){
      cb(null, new SimpleDataPresenter(trip).transform());
    });
  }
  else{
    this.logger.error({
      input: {
        id: id
      }
    }, "Invalid input");
    cb({message: "Invalid input"});
  }
},


module.exports = Trip;