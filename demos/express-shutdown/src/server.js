/* eslint-disable */
const app = require('./app');

// Constants
const port = process.env.PORT || 8080;
// if you're not using docker-compose for local development, this will default to 8080
// to prevent non-root permission problems with 80. Dockerfile is set to make this 80
// because containers don't have that issue :)

const server = app.listen(port, () => {
  console.log(`Server listening on port: ${server.address().port}`);
  // limit keep alive to 6sec
  server.timeout = 6000;
});

//
// need this in docker container to properly exit since node doesn't handle SIGINT/SIGTERM
//

// // quit on ctrl-c when running docker in terminal
// process.on('SIGINT', function onSigint() {
//   console.info(
//     'Got SIGINT (aka ctrl-c in docker). Graceful shutdown ',
//     new Date().toISOString(),
//   );
//   shutdown();
// });

// // quit properly on docker stop
// process.on('SIGTERM', function onSigterm() {
//   console.info(
//     'Got SIGTERM (docker container stop). Graceful shutdown ',
//     new Date().toISOString(),
//   );
//   shutdown();
// });

// // shut down server
// function shutdown() {
//   server.close(function onServerClosed(err) {
//     if (err) {
//       console.error(err);
//       process.exitCode = 1;
//     }
//     process.exit();
//   });
// }
