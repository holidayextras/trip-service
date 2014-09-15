var logger = require('lib/logger');
var Exception = require('lib/exception');
var iz = require('iz');

var ModelBase = function(dbModel){
  if(iz.empty(dbModel)){
    Exception.throw('No data model given');
  }
  this.__db = dbModel;
};

ModelBase.prototype.save = function(cb){
 this.__db.save(function(err){
   if(err) return logger.error(err);
   if(cb) cb();
 });
};

//data that is contained in this instance
ModelBase.prototype.data = function(){
  return this.__db;
};

module.exports = ModelBase;