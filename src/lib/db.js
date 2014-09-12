var config = require('config');
var dynamoose = require('dynamoose');
var dbConfig = config.get('db');
dynamoose.AWS.config.update(dbConfig.aws);
dynamoose.local(dbConfig.url);

module.exports = dynamoose;
