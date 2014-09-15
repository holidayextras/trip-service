var logger = require('lib/logger');

var Exception = {
  throw: function(message){
    logger.error(message);
    throw new Error(message);
  }
};

module.exports = Exception;