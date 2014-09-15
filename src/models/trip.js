var DbTrip = require('models/db/trip');
var uuid = require('node-uuid');
var logger = require('lib/logger');

var Trip = function(dbModel){
  this.__db = dbModel;
};

Trip.prototype.save = function(cb){
  this.__db.save(function(err){
    if(err) return logger.error({message: err});
    if(cb){
      cb();
    }
  });
};

Trip.prototype.id = function(){
  return this.__db.id;
}

//data that is contained in this instance
Trip.prototype.data = function(){
  return this.__db;
};

Trip.prototype.update = function(data, cb){
  this.__db.update({id: this.id}, {$ADD: data}, function(err){
    if(err) return logger.error({message: err});
    cb();
  });
};

Trip.create = function(data){
  data.id = uuid.v1()
  var dbModel = new DbTrip(data);
  return new Trip(dbModel);
};

Trip.getById = function(id, cb){
  DbTrip.get({id: id}, function(err, trip){
    if(err) return logger.error({message: err});
    cb(trip);
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
}

module.exports = Trip;