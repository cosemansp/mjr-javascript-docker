const express = require('express')

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
      message: 'Hello belated world'});
  }, timeout * 1000)
})


// Launch listening server on port 8080
const httpServer = app.listen(8080, () => {
  console.log(`Server listening on port: ${httpServer.address().port}`)
  // limit keep alive to 6sec
  httpServer.timeout = 6000;
})

// Do any necessary shutdown logic for our application here
const shutdown = (signal) => {
  console.log("Shutdown by", signal);
  httpServer.close((err) => {
    console.log(`  server stopped`);
    process.exit(err ? 1 : 0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'));


