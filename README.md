# Travelblog-content

This is a content service for the travelblog infrastructure. The purpose is to upload and expose resources - it is secured
by an API key - the authentication in the future should be moved out into a different service and shared across other
backend services.

## Installation

```
$ npm install
$ mv config.js.template config.js
```

At this point we should fill out config file.

## Running

```
$ npm run start
```

## Deployment

```
$ docker-compose build
$ docker-compose up -d
```
