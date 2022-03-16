## Description

Survey Town is a demo portfolio app that allows users to browse, create, and take surveys. The server is built on the [Nest](https://nestjs.com) framework, featuring a Controller-Service-Repository pattern and Dependency Injection, and the client is a [React](https://reactjs.org) app, using [Redux Toolkit](https://redux-toolkit.js.org/), [Redux Observable](https://redux-observable.js.org/), and [Sass](https://sass-lang.com/). Both client and server are written entirely in [Typescript](https://www.typescriptlang.org/).

[Live Demo](https://surveytown.net)

## Installation

### Server
```bash
$ npm install
```

### Client
```bash
$ cd client
$ npm install
```

## Configuration

### Server
Create a git-ignored file at the project root named `.env` that looks like the following:

```
# Supply a MongoDb connection string
DB_URL=mongodb+srv://USERNAME:PW@cluster0.abc123.mongodb.net/DB_NAME?retryWrites=true&w=majority

# Generate a strong random value 
AUTH_SECRET=39834oidsknkvnweikfjf4i4i$%$dfkdksj

# use 1 in production
USE_SECURE_SESSION=0

# Can be whatever you want
SESSION_COOKIE_NAME=connect.sid

FRONT_END_ORIGIN=http://localhost:3001

NODE_ENV=development
```

### Client
Create a git-ignored file in the client folder named `/client/.env` that looks like the following:

```
REACT_APP_BASE_API_URL=http://localhost:3000/api
REACT_APP_ENV=development
```


## Running the server

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Server Tests

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Running the client
Because the server will already be running on port `3000` by default, the client start command will give you the option to run on a different port (`3001`). Choose `Y` (yes) for this option.

```bash
# development
$ npm start

# production build
$ npm run build
```

For development, go to http://localhost:3001 to view the app.

## Client tests

```bash
# unit tests
$ npm test

# test coverage
$ npm run test:coverage
```