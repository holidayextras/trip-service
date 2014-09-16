//logging system
var bunyan = require('bunyan');
var config = require('config');
var logConfig = config.get('logger');

var streams = {
  level: logConfig.level,
  stream: process.stderr
};

//override default logging to write to a specific file
if(logConfig.file){
  streams = {
    level: logConfig.level,
    path: logConfig.file
  };
}

var logger = bunyan.createLogger({
  name: "trip-service",
  streams: [streams]
});
logger.level(logConfig.level);

module.exports = logger;