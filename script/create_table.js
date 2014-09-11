var AWS = require('aws-sdk');
AWS.config.update({ accessKeyId: "myKeyId", secretAccessKey: "secretKey", region: "us-east-1" });
var dynamodb = new AWS.DynamoDB(
  {
    "endpoint": new AWS.Endpoint('http://localhost:8000'),
    region: "us-east-1"
  }
);

var params = {
  TableName: 'Trip'
};

dynamodb.describeTable(params, function(err, data) {

  //if (err) console.log(err, err.stack); // an error occurred
  //else console.log(data);           // successful response

  if(!err){

    console.log("Table exists");
  
    var params = {
      TableName: 'Trip'
    };

    dynamodb.deleteTable(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data);           // successful response
    });
  
  }
});

params = {
  "AttributeDefinitions": [
    {
      "AttributeName": "ID",
      "AttributeType": "N"
    }
  ],
  "TableName": "Trip",
  "KeySchema": [
    {
      "AttributeName": "ID",
      "KeyType": "HASH"
    }
  ],
  "ProvisionedThroughput": {
    "ReadCapacityUnits": 1,
    "WriteCapacityUnits": 1
  }
};
//dynamodb.createTable(params, function(err, data) {
//  if (err) console.log(err, err.stack); // an error occurred
//  else console.log(data);           // successful response
//});
