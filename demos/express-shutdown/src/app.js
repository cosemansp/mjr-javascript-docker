// simple node web server that displays hello world
const express = require('express')

// morgan provides easy logging for express, and by default it logs to stdout
// which is a best practice in Docker
const morgan = require('morgan');

// Create app
const app = express()

// Define request response in root URL (/)
app.get('/', (req, res) => {
  res.send('Hello from Express!@')
})

// Long running request
app.get('/wait', (req, res) => {
  const timeout = 5;
  console.log(`received request, waiting ${timeout} seconds`);
  setTimeout(() => {
    res.send({
      id: Date.now(),
      message: 'Hello belated world'
    });
  }, timeout * 1000)
})

// Health check
app.get('/healthz', (req, res) => {
  //
  // Perform some health check here
  //
  res.send('All OK')
})

module.exports = app;
