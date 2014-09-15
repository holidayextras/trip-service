var Server = function(){
  var Router = require( 'paper-router' );
  var restify = require('restify');
  var config = require('config');
  var logger = require('lib/logger');

  var server = restify.createServer({
    name: 'trip-service',
    log: logger
  });
  server
    .use(restify.fullResponse())
    .use(restify.bodyParser())
    .use(restify.queryParser())
    .use(restify.requestLogger())
    .use(restify.gzipResponse())
  ;

  //log server requests
  server.on('after', restify.auditLogger({
    log: logger
  }));

  //log uncaught exceptions
  server.on('uncaughtException', function(req, res, route, err){
    logger.error(err);
    res.send(new restify.InternalError(err.message));
  });

  var serverConfig = config.get('server');
  server.listen(serverConfig.port || process.env.PORT, function(){
    logger.info('%s listening at %s', server.name, server.url);
  });

  var routes = function( router ) {
    router.resources('trip');
  }

  var router = new Router(server, __dirname + '/../controllers', routes);

};

module.exports = Server;