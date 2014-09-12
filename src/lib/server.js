var Server = function(){
  var Router = require( 'paper-router' );
  var restify = require('restify');
  var config = require('config');

  var server = restify.createServer({name: 'trip-service'});
  server
    .use(restify.fullResponse())
    .use(restify.bodyParser())
    .use(restify.queryParser())
  ;
  var serverConfig = config.get('server');
  server.listen(serverConfig.port || process.env.PORT, function(){
    console.log('%s listening at %s', server.name, server.url);
  });

  var routes = function( router ) {
    router.resources('trip');
  }

  var router = new Router(server, __dirname + '/../controllers', routes);

};

module.exports = Server;