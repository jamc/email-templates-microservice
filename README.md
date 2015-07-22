# Fleetster Email Templates Microservice

## How to modify and run the project?

More explicit information in [Swagger Node](https://github.com/swagger-api/swagger-node)

### 1. Install the swagger module

```bash
$ npm install -g swagger
```

### 2. Use the Swagger Editor

```bash
$ swagger project edit
```

### 3. Write controllers

The `x-swagger-router-controller` element specifies the name of the controller file associated with the path.

Controller source code is placed in `./api/controllers`.

The `operationId` element specifies which controller function to call.

### 4. Run the server

```bash
$ swagger project start
```