const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`<h1>Hello from NodeJS</h1>`);
}).listen(8080);

console.log('server running on port 8080');
