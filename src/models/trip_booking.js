var DbTripBooking = require('models/db/trip_booking');
var logger = require('lib/logger');

var TripBooking = function(dbModel){
   this.__db = dbModel;
};

TripBooking.prototype.save = function(cb){
  this.__db.save(function(err){
    if(err) return logger.error({message: err});
    if(cb){
      cb();
    }
  });
};

TripBooking.prototype.id = function(){
  return this.__db.ref;
}

//data that is contained in this instance
TripBooking.prototype.data = function(){
  return this.__db;
};

TripBooking.create = function(data){
  var dbModel = new DbTripBooking(data);
  return new TripBooking(dbModel);
};

TripBooking.getById = function(id, cb){
  DbTripBooking.get({ref: id}, function(err, tripBooking){
    if(err) return logger.error({message: err});
    cb(tripBooking);
  });
};

module.exports = TripBooking;
