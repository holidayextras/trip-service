var dynamoose = require('dynamoose');
dynamoose.local('http://app-vm.holidayextras.co.uk:8000');
//dynamoose.local();
module.exports = dynamoose;
