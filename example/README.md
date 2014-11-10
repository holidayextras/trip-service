# Trip Service server example

## Running

### Locally

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
node_modules/nodemon/bin/nodemon.js server.js
````

Tests:

Spawning own server to test against:
````
npm test
````

Using the current running server to test against:
````
NO_TEST_SERVER=1 npm test
````

### Staging/production

Set environment in elastic beanstalk

````
NODE_PATH = ./src
NODE_ENV = staging
AWS_ACCESS_KEY_ID = "Your AWS Access Key ID"
AWS_SECRET_ACCESS_KEY = "Your AWS Secret Access Key"
AWS_REGION = "us-east-1"
````

### Endpoints

Show all trips (dev only):

````
curl -i http://localhost:3000/trip
````

Get a trip via a booking ref:

````
curl -i http://localhost:3000/trip?ref=abc
````

Create a new trip with two linked bookings:

````
curl -i -X POST -d 'bookings[]=abc&bookings[]=cde&email=test@test.com' http://localhost:3000/trip
```` 

Get trip:

````
curl -i http://localhost:3000/trip/cc66e510-322d-11e4-8459-1150f735bf96
````

Update a trip with a new booking ref:

````
curl -i -X PUT -d 'bookings[]=222' http://localhost:3000/trip/0a3a4810-327d-11e4-afa6-23eed8fcd0d2
````
