const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Todo = require('./todoModel');

// Set mongoose.Promise to any Promise implementation
mongoose.Promise = Promise;

// Connect to mongoDB
const mongoUri = process.env.MONGO_URL || 'mongodb://localhost:27017/todoDemo';
console.log('Connecting to ', mongoUri)
mongoose.connect(mongoUri, {
    useMongoClient: true,
});

// Create Express App
const app = express();
app.use(bodyParser.json())

// Todo routes
app.get('/todos', function (req, res) {
  Todo.find()
    .exec()
    .then(todos => res.send(todos))
    .catch(err => res.send(err));
});
app.post('/todos', function (req, res) {
  const todo = new Todo(req.body);
  todo.save()
    .then((todo) => res.status(201).json(todo))
    .catch(err => res.status(400).end());
});

// Listen to incomming requests
const httpServer = app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

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
