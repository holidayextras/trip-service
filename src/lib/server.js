var Server = function(){
  //local development only
  process.env['AWS_ACCESS_KEY_ID'] = 'myKeyId';
  process.env['AWS_SECRET_ACCESS_KEY'] = 'secretKey';
  process.env['AWS_REGION'] = 'us-east-1';

  var Router = require( 'paper-router' );
  var restify = require('restify');

  var server = restify.createServer({name: 'trip-service'});
  server
    .use(restify.fullResponse())
    .use(restify.bodyParser())
    .use(restify.queryParser())
  ;
  server.listen(3000, function(){
    console.log('%s listening at %s', server.name, server.url);
  });

  var routes = function( router ) {
    router.resources('trip');
  }

  var router = new Router(server, __dirname + '/../controllers', routes);

};

module.exports = Server;