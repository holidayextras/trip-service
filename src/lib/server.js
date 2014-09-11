exports.Server = function(){
  //local development only
  process.env['AWS_ACCESS_KEY_ID'] = 'myKeyId';
  process.env['AWS_SECRET_ACCESS_KEY'] = 'secretKey';
  process.env['AWS_REGION'] = 'us-east-1';

  var restify = require('restify');
  var Trip = require('models/trip');
  var TripBooking = require('models/trip_booking');
  var SimpleDataPresenter = require('presenters/simple_data');

  var server = restify.createServer({name: 'trip-service'});
  server
    .use(restify.fullResponse())
    .use(restify.bodyParser())
    .use(restify.queryParser())
  ;
  server.listen(3000, function(){
    console.log('%s listening at %s', server.name, server.url);
  });

  server.get('/', function(req, res, next){
    if(req.params.ref){  //get a single trip via booking ref
      TripBooking.query('ref').eq(req.params.ref).exec(function(err, bookings){
        if(err){
          return console.log(err);
        }
        //only caring about the first match
        if(bookings.length){
          Trip.getById(bookings.shift().tripId, function(trip){
            if(trip){
              res.send(200, [new SimpleDataPresenter(trip).transform()]);
            }
            else{
              res.send(404, []);
            }
          });
        }
        else{
          res.send(404, []);
        }
      });
    }
    else{ //get all trips, (development only)
      Trip.findAll(function(trips){
        res.send(200, SimpleDataPresenter.transformModels(trips));
      });
    }
  });

  //create a trip
  server.post('/', function(req, res, next){
    var bookings = req.params.bookings || [];
    var trip = Trip.create({
      bookings: bookings
    });

    trip.save(function(err){
      //create booking ref lookup if required
      bookings.forEach(function(booking){
        var tripBooking = new TripBooking({
          ref: booking,
          tripId: trip.id()
        });
        tripBooking.save(function(err){
          if(err){
            return console.log(err);
          }
        });
      });
      res.send(201, new SimpleDataPresenter(trip).transform());
    });

  });

  //get a single trip
  server.get('/:id', function (req, res, next){
    Trip.getById(req.params.id, function(trip){
      if(trip){
        res.send(new SimpleDataPresenter(trip).transform());
      }
      else{
        res.send(404);
      }
    });
  });

  //add another booking to a trip
  server.put('/:id', function(req, res, next){
    Trip.getById(req.params.id, function(trip){
      if(trip){
        //update the trip with the new booking
        console.log('found trip');
        console.log(req.params.bookings);
        sentBookings = req.params.bookings || []
        trip.update({bookings: sentBookings}, function(){
          sentBookings.forEach(function(ref){
            console.log("adding index for: " + ref);

            TripBooking.get({ref: ref}, function(err, tripBooking){
              if(err){
                return console.log(err);
              }
              if(!tripBooking){
                console.log('creating new tripbooking for: ' + ref);
                //add to the booking index lookup
                tripBooking = new TripBooking({
                 ref: ref,
                 tripId: trip.id
                });
                tripBooking.save(function(err){
                  if(err){
                    return console.log(err);
                  }
                });
              }
            });

          });

        });
        //get the updated trip data
        Trip.getById(trip.id, function(trip){
          res.send(new SimpleDataPresenter(trip).transform());
        });
      }
      else{ 
        res.send(404);
      }
    });
  });
};