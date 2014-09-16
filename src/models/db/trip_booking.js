//Additional index table for looking up via booking refs
var db = require('lib/db');

var DbTripBooking = db.model('TripBooking', {
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

module.exports = DbTripBooking;