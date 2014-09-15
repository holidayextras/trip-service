var DbTripBooking = require('models/db/').TripBooking;
var logger = require('lib/logger');
var util = require('util');
var ModelBase = require('models/base');

TripBooking.prototype.id = function(){
  return this.__db.ref;
}

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

util.inherits(TripBooking, ModelBase);

module.exports = TripBooking;
