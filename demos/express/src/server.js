const express = require('express');

const app = express();

// Define request response in root URL (/)
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Launch listening server on port 8080
app.listen(8080, () => {
  console.log('app listening on port 8080!');
});
