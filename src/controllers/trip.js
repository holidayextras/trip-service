var Trip = require('index');

var TripController = {

  //view trip via booking ref and email
  index: function(req, res, next){
    var trip = new Trip();
    trip.find(req.params.email, req.params.ref, function(error, output){
      if(error){
        res.send(400, error);
        return next();
      }
      if(output){
        res.send(200, [output]);
      }
      else{
        res.send(404, []);
      }
      return next();
    });
  },

  //create a trip
  create: function(req, res, next){
    var trip = new Trip();
    trip.create(req.params.email, req.params.bookings, function(error, output){
      if(error){
        res.send(400, error);
      }
      else{
        res.send(201, output);
      }
      return next();
    });
  },

  //get a single trip via trip id
  show: function (req, res, next){
    var trip = new Trip();
    trip.show(req.params.id, function(error, output){
      if(error){
        res.send(400, error);
      }
      else{
        res.send(200, output);
      }
      return next();
    });
  },

  //update a trip with new booking references
  update: function(req, res, next){
    var trip = new Trip();
    trip.update(req.params.id, req.params.bookings, function(error, output){
      if(error){
        res.send(400, error);
      }
      else{
        res.send(200, output);
      }
      return next();
    });
  },

  //not implemented
  destroy: function(req, res, next){
    res.send(501);
    return next();
  }

};

module.exports = TripController;