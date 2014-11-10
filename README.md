# Trip Service

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

Tests:

````
npm test
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
