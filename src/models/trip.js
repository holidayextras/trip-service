var DbTrip = require('models/db/trip');
var uuid = require('node-uuid');
var logger = require('lib/logger');
var util = require('util');
var ModelBase = require('models/base');

var Trip = function(dbModel){
  this.__db = dbModel;
};

Trip.prototype.id = function(){
  return this.__db.id;
}

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
  dbs[wantedclass].get({id: id}, function(err, trip){
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

util.inherits(Trip, ModelBase);

module.exports = Trip;