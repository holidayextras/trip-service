//local development only
process.env['AWS_ACCESS_KEY_ID'] = 'myKeyId';
process.env['AWS_SECRET_ACCESS_KEY'] = 'secretKey';
process.env['AWS_REGION'] = 'us-east-1'; 

var dynamoose = require('dynamoose');
dynamoose.local();

var restify = require('restify');
var uuid = require('node-uuid');

//Main data storage model
var Trip = dynamoose.model('Trip', {
  id: {
    type: String,
    required: true,
    hashKey: true,
  },
  bookings: {
    type: [String]
  }
});

//Additional index table for looking up via booking refs
var TripBooking = dynamoose.model('TripBooking', {
  ref: {
    type: String,
    required: true,
    hashKey: true
  },
  tripId: {
    type: String,
    required: true
  }
});

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
        Trip.get({id: bookings.shift().tripId}, function(err, trip){
          if(err){
            return console.log(err);
          }
          if(trip){
            res.send(200, [trip]);
          }
          else{
            res.send(404);
          }
        });
      }
      else{
        res.send(404);
      }
    });
  }
  else{	//get all trips, (development only)
    Trip.scan().exec(function(err, trips, lastKey){
      res.send(200, trips);
    });
  }
});

//create a trip
server.post('/', function(req, res, next){
  var bookings = req.params.bookings || [];
  var tripId = uuid.v1(); 
  var trip = new Trip({
    id: tripId,
    bookings: bookings
  });

  trip.save(function(err){
    if(err){
      return console.log(err);
    }
    else{
      //create booking ref lookup if required
      bookings.forEach(function(booking){
        var tripBooking = new TripBooking({
          ref: booking,
          tripId: tripId
        });
        tripBooking.save(function(err){
          if(err){
            return console.log(err);
          }
        });
      });
      res.send(201, trip);
    }
  });

});

//get a single trip
server.get('/:id', function (req, res, next){
  Trip.get({id: req.params.id}, function(err, trip){
    if(err){
      return console.log(err);
    }
    if(trip){
      res.send(trip);
    }
    else{
      res.send(404);
    }
  });
});


//add another booking to a trip
server.put('/:id', function(req, res, next){
  Trip.get({id: req.params.id}, function(err, trip){
    if(err){
      return console.log(err);
    }
    if(trip){
      //update the trip with the new booking
      Trip.update({id: trip.id}, {$ADD: {bookings: [req.params.booking]}}, function(err){
        if(err){
          return console.log(err);
        }
        //add to the booking index lookup
        var tripBooking = new TripBooking({
          ref: req.params.booking,
          tripId: trip.id
        });
        tripBooking.save(function(err){
          if(err){
            return console.log(err);
          }
        });
      });
      //get the updated trip data
      Trip.get({id: trip.id}, function(err, trip){
        if(err){
          return console.log(err);
        }
        res.send(trip);
      });
    }
    else{ 
      res.send(404);
    }
  });                                        
});
