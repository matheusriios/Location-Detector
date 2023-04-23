# Location Detector

### Installing

```
  docker-compose run app ash -c "npm install"
```

## Running

### Start the App

```
  Create the .env file at the root of the project and add the variable IP_STACK_API_ACCESS_KEY=api-mock-access, replacing the value api-mock-access with your API key. 
  docker-compose up app
  To produce a message to Kafka, use the tmp/producer.js file.
```

### Run Tests

```
  docker-compose run tst
```

## Scripts

- `dev`: Run the application in development mode
- `start:prod` Run the application in production mode
- `test`: Run the test suite

### Redis auth using redis-cli

```
  docker run -it <container-id> ash
  redis-cli
  AUTH eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81
```
