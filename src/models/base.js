//Abstract base model for all data models
var logger = require('../lib/logger');
var iz = require('iz');

var ModelBase = function(dbModel){
  if(iz.empty(dbModel)){
    throw new Error('No data model given');
  }
  this.__db = dbModel;
};

//Save any updates to the models's data to the database
ModelBase.prototype.save = function(cb){
 this.__db.save(function(err){
   if(err) return logger.error(err);
   if(cb) cb();
 });
};

//raw data that is contained in this instance
ModelBase.prototype.data = function(){
  return this.__db;
};

module.exports = ModelBase;