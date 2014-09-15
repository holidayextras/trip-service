var Trip = require('models/trip');
var TripBooking = require('models/trip_booking');
var SimpleDataPresenter = require('presenters/simple_data');

var TripController = {

  index: function(req, res, next){
    if(req.params.ref){  //get a single trip via booking ref
      TripBooking.getById(req.params.ref, function(tripBooking){
        if(tripBooking){
          Trip.getById(tripBooking.id(), function(trip){
            if(trip){
              res.send(200, [new SimpleDataPresenter(trip).transform()]);
            }
            else{
              res.send(404, []);
            }
          });
        }
        else{
          res.send(404, []);
        }
      });
    }
    else{ //get all trips, (development only)
      req.log.debug("Getting all trips");
      Trip.findAll(function(trips){
        if(trips.length){
          req.log.debug('got some trips');
          res.send(200, SimpleDataPresenter.transformModels(trips));
        }
        else{
          res.send(404, []);
        }
      });
    }
    return next();
  },

  //create a trip
  create: function(req, res, next){
    var bookings = req.params.bookings || [];
    var email = req.params.email;
    var trip = Trip.create({
      bookings: bookings,
      email: email
    });

    trip.save(function(){
      //create booking ref lookup if required
      bookings.forEach(function(booking){
        var tripBooking = TripBooking.create({
          ref: booking,
          tripId: trip.id()
        });
        tripBooking.save();
      });
      res.send(201, new SimpleDataPresenter(trip).transform());
    });
    return next();
  },

  //get a single trip
  show: function (req, res, next){
    Trip.getById(req.params.id, function(trip){
      if(trip){
        res.send(new SimpleDataPresenter(trip).transform());
      }
      else{
        res.send(404);
      }
    });
    return next();
  },

  //add another booking to a trip
  update: function(req, res, next){
    Trip.getById(req.params.id, function(trip){
      if(trip){
        //update the trip with the new booking
        req.log.debug('found trip');
        req.log.debug({bookings: req.params.bookings});
        sentBookings = req.params.bookings || []
        trip.update({bookings: sentBookings}, function(){
          sentBookings.forEach(function(ref){
            req.log.debug('adding index for: ' + ref);

            TripBooking.getById(ref, function(tripBooking){
              if(!tripBooking){
                req.log.debug('creating new tripbooking for: ' + ref);
                //add to the booking index lookup
                tripBooking = new TripBooking({
                 ref: ref,
                 tripId: trip.id()
                });
                tripBooking.save();
              }
            });

          });

        });
        //get the updated trip data
        Trip.getById(trip.id(), function(trip){
          res.send(new SimpleDataPresenter(trip).transform());
        });
      }
      else{
        res.send(404);
      }
    });
    return next();
  },

  //not implemented
  destroy: function(){
    res.send(501);
    return next();
  }

};

module.exports = TripController;