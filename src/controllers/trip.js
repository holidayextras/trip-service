var Trip = require('models/trip');
var TripBooking = require('models/trip_booking');
var SimpleDataPresenter = require('presenters/simple_data');
var iz = require('iz');

var TripController = {

  index: function(req, res, next){
    var status = 404;
    var output = [];
    if(iz(req.params.email).required().string().email() && iz(req.params.ref).required().string().alphaNumeric()){
      TripBooking.getById(req.params.ref, function(tripBooking){
        Trip.getById(tripBooking.id(), function(trip){
          status = 200;
          output = [new SimpleDataPresenter(trip).transform()];
        });
      });
    }
    else{
      req.log.error({input: req.params}, "Invalid input");
      status = 400;
      output = {message: 'Invalid input'};
    }
    res.send(status, output);
    return next();
  },

  //create a trip
  create: function(req, res, next){
    if(iz(req.params.email).required().string().email() && (req.params.bookings === undefined || Array.isArray(req.params.bookings))){
      req.log.debug("input ok");
      var bookings = req.params.bookings || [];
      var email = req.params.email;
      var trip = Trip.create({
        bookings: bookings,
        email: email
      });
      req.log.debug("created trip");
      trip.save(function(){
        req.log.debug('saved trip');
        //create booking ref lookup if required
        bookings.forEach(function(booking){
          var tripBooking = TripBooking.create({
            ref: booking,
            tripId: trip.id()
          });
          tripBooking.save();
          req.log.debug('saved tripbooking');
        });
        res.send(201, new SimpleDataPresenter(trip).transform());
      });
    }
    else{
      req.log.error({input: req.params}, "Invalid input");
      res.send(400, {message: "Invalid input"});
    }
    return next();
  },

  //get a single trip
  show: function (req, res, next){
    var status = 404;
    var output = null;
    if(iz(req.params.id).required().string() && /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/i.test(req.params.id)){
      Trip.getById(req.params.id, function(trip){
        status = 200;
        output = new SimpleDataPresenter(trip).transform();
      });
    }
    else{
      req.log.error({input: req.params}, "Invalid input");
      status = 400;
      output = {message: "Invalid input"};
    }
    res.send(status, output);
    return next();
  },

  //add another booking to a trip
  update: function(req, res, next){
    status = 404;
    output = null;
    if(iz(req.params.id).required().string() && /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/i.test(req.params.id)){
      Trip.getById(req.params.id, function(trip){
        //update the trip with the new booking
        req.log.debug('found trip');
        req.log.debug({bookings: req.params.bookings});
        sentBookings = req.params.bookings || []
        trip.update({bookings: sentBookings}, function(){
          sentBookings.forEach(function(ref){
            req.log.debug('adding index for: ' + ref);

            TripBooking.getById(ref, function(tripBooking){
              req.log.debug('creating new tripbooking for: ' + ref);
              //add to the booking index lookup
              tripBooking = new TripBooking({
               ref: ref,
               tripId: trip.id()
              });
              tripBooking.save();
            });

          });

        });
        //get the updated trip data
        Trip.getById(trip.id(), function(trip){
          status = 200;
          output = new SimpleDataPresenter(trip).transform();
        });
      });
    }
    else{
      req.log.error({input: req.params}, "Invalid input");
      status = 400;
      output = {message: "Invalid input"};
    }
    res.send(status, output);
    return next();
  },

  //not implemented
  destroy: function(req, res, next){
    res.send(501);
    return next();
  }

};

module.exports = TripController;