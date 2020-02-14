const express = require('express');

const router = require('./data/router');

const server = express();

server.use(express.json());
server.use('/api/', logger, router);


// Logging middleware
function logger(req, res, next) {
  var queryDate = new Date().toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  console.log(`${req.method} request to ${req.originalUrl} at ${queryDate}`);
  next();
}

module.exports = server;
