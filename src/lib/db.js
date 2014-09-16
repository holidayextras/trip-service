//database layer
var config = require('config');
var dynamoose = require('dynamoose');
var dbConfig = config.get('db');
if(dbConfig.aws) dynamoose.AWS.config.update(dbConfig.aws);
if(dbConfig.url) dynamoose.local(dbConfig.url);

module.exports = dynamoose;
