# Trip Service PoC

## Testing

Start local dynamodb:

````
script/run_local_dynamodb.sh
````

Start server:

````
node app.js
````

### Endpoints

Show all trips (dev only):

````
curl -i http://app-vm.holidayextras.co.uk:3000/
````

Create a new trip with two linked bookings:

````
curl -i -X POST -d 'bookings[]=abc&bookings[]=cde' http://app-vm.holidayextras.co.uk:3000/
```` 

Get trip:

````
curl -i http://app-vm.holidayextras.co.uk:3000/cc66e510-322d-11e4-8459-1150f735bf96
````

Get a trip via a booking ref:

````
curl -i http://app-vm.holidayextras.co.uk:3000/booking/abc

````

Update a trip with a new booking ref:

````
curl -i -X PUT -d 'booking=222' http://app-vm.holidayextras.co.uk:3000/0a3a4810-327d-11e4-afa6-23eed8fcd0d2
````
