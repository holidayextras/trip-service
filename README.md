# Trip Service

## Running locally

Start local dynamodb:

````
script/run_local_dynamodb.sh
````

Set environment:

````
export NODE_PATH=./src
export NODE_ENV=development
````

Start server:

````
node app.js
````

Tests:

````
npm test
````

### Endpoints

Show all trips (dev only):

````
curl -i http://app-vm.holidayextras.co.uk:3000/trip
````

Get a trip via a booking ref:

````
curl -i http://app-vm.holidayextras.co.uk:3000/trip?ref=abc
````

Create a new trip with two linked bookings:

````
curl -i -X POST -d 'bookings[]=abc&bookings[]=cde' http://app-vm.holidayextras.co.uk:3000/trip
```` 

Get trip:

````
curl -i http://app-vm.holidayextras.co.uk:3000/trip/cc66e510-322d-11e4-8459-1150f735bf96
````

Update a trip with a new booking ref:

````
curl -i -X PUT -d 'booking=222' http://app-vm.holidayextras.co.uk:3000/trip/0a3a4810-327d-11e4-afa6-23eed8fcd0d2
````

## Todo

* Model classes should share interface
* Unit tests for models
* Docs
* Input validation
* Logging
