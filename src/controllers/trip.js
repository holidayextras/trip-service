var Trip = require('models/trip');
var TripBooking = require('models/trip_booking');
var SimpleDataPresenter = require('presenters/simple_data');
var iz = require('iz');

var TripController = {

  //view trip via booking ref and email
  index: function(req, res, next){
    var status = 404;
    var output = [];
    if(iz(req.params.email).required().string().email().valid && iz(req.params.ref).required().string().alphaNumeric().valid){
      TripBooking.getById(req.params.ref, function(tripBooking){
        Trip.getById(tripBooking.id(), function(trip){
          //TODO check for email address of trip here
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
    if(iz(req.params.email).required().string().email().valid && iz(req.params.bookings).anArray().valid){
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

  //get a single trip via trip id
  show: function (req, res, next){
    var status = 404;
    var output = null;
    if(iz(req.params.id).required().string().valid && /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/i.test(req.params.id)){
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

  //update a trip with new booking references
  update: function(req, res, next){
    req.log.debug("in update");
    if(iz(req.params.id).required().string().valid && /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/i.test(req.params.id) && iz(req.params.bookings).required().anArray().valid){
      req.log.debug("input ok");
      Trip.getById(req.params.id, function(trip){
        //update the trip with the new booking
        req.log.debug('found trip');
        req.log.debug({bookings: req.params.bookings});
        sentBookings = req.params.bookings || [];
        trip.update({bookings: sentBookings}, function(){
          //get the updated trip data
          Trip.getById(trip.id(), function(trip){
            res.send(200, new SimpleDataPresenter(trip).transform());
          });
        });
      },
      function(){
        req.log.debug('trip not found');
        res.send(404);
      });
    }
    else{
      req.log.error({input: req.params}, "Invalid input");
      res.send(400, {message: "Invalid input"});
    }
    return next();
  },

  //not implemented
  destroy: function(req, res, next){
    res.send(501);
    return next();
  }

};

module.exports = TripController;