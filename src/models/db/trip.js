//Main data storage model
var db = require('lib/db');

var DbTrip = db.model('Trip', {
  id: {
    type: String,
    required: true,
    hashKey: true,
  },
  bookings: {
    type: [String]
  },
  email: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    required: true,
    default: 1
  }
});

module.exports = DbTrip;