var logger = require('lib/logger');
//var DbModels = require('lib/models/db/');

ModelBase.prototype.save = function(cb){
 this.__db.save(function(err){
   if(err) return logger.error({message: err});
   if(cb) cb();
 });
};

//data that is contained in this instance
ModelBase.prototype.data = function(){
  return this.__db;
};

module.exports = ModelBase;