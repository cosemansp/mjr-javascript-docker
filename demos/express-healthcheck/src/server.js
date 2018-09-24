const express = require('express')

const app = express()

// Define request response in root URL (/)
app.get('/', (req, res) => {
  res.send('Hello from Express!@')
})

// Health check
app.get('/healthz', (req, res) => {
  //
  // Perform some health check here
  //
  res.send('All OK')
})

// Launch listening server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`app listening on port: ${port}`)
})
