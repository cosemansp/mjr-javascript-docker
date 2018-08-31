---
title: Docker for JavaScript Developers
transition: 'fade'
verticalSeparator: "^\\*\\*\\*"
---

# Docker for JavaScript Developers

#### Use the power of docker to your advantage

<small>by Peter Cosemans</small>
<br>
<br>
<small>
Copyright (c) 2018 Euricom nv. Licensed under the [MIT license](https://opensource.org/licenses/MIT).
</small>

<!-- markdownlint-disable -->
<br>
<style type="text/css">
.reveal section img {
    background:none;
    border:none;
    box-shadow:none;
}
.reveal ul li {
    font-size: 2.0em;
    margin: 0px;
    line-height: 0;
}


.reveal h1 {
    font-size: 3.0em;
}

.reveal h2 {
    font-size: 2.00em;
}
.reveal h3 {
    font-size: 1.50em;
}
.reveal p {
    font-size: 70%;
}
.reveal blockquote {
    font-size: 100%;
}
.reveal pre code {
    display: block;
    padding: 5px;
    overflow: auto;
    max-height: 800px;
    word-wrap: normal;
    font-size: 100%;
}
</style>

---

# Run mongoDB from docker

Create local folder (and set access rights)

```
sudo mkdir -p /data/docker
sudo chown $USER /data/docker
```

Add File Sharing (for MacOS)

<img src="images/docker-file-sharing.png">
<br><br>

Create container & run

```bash
# mongodb 3.6
docker run --publish 27017:27017 \
    --name mongodb \
    --volume /data/docker/mongo-3.6:/bitnami \
    bitnami/mongodb:3.6
```

Connect DB with shell

```bash
$ docker exec -it mongodb mongo
MongoDB shell version v3.6.2
connecting to: mongodb://127.0.0.1:27017/localhost
MongoDB server version: 3.6.6
>
```

Restart

```bash
docker start mongodb
```

---

# Dockerizing a Node.js app
> You first docker image

***

## A mini http application

```js
const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`<h1>Hello from NodeJS</h1>`);
}).listen(8080);
```

## Dockerizing the Node.js Applications

Dockerfile

```docker
FROM node
RUN mkdir -p /app
COPY index.js /app
EXPOSE 8080
CMD [ "node", "/app/index" ]
```

build it

```bash
docker build -t node-app .
```

and run it

```bash
docker run -p 8081:8080 -d node-app
```

***

## Create NodeJS app with dependencies

A more real live application with Express

```json
{
  "name": "node-express",
  "version": "1.0.1",
  "scripts": {
    "start": "node ./src/server.js",
    "start:debug": "nodemon ./src/server.js",
    "lint": "eslint \"**/*.js\"",
    "docker:build": "docker build -t node-express .",
    "docker:run": "docker run -p 8081:8080 -d node-express"
  },
  "dependencies": {
    "express": "^4.16.3"
  },
  "devDependencies": {
    "eslint": "^4.19.1",
    "eslint-config-airbnb-base": "^12.1.0",
    "eslint-config-prettier": "^2.9.0",
    "eslint-plugin-import": "^2.12.0",
    "nodemon": "^1.17.5",
    "prettier": "^1.6.1"
  }
}
```

***

## Dockerize the application

```docker
# Dockerfile
FROM node

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json /app/
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production --quiet

# Bundle app source
COPY . /app

# Start app
CMD [ "npm", "start" ]
EXPOSE 8080

```

***

## Dockerize the application

Only include files you really want with `.dockerignore`

```docker
# Ignore everything
**

# Allow files and directories
!package.json
!yarn.lock
!/src/**

# Ignore unnecessary files inside allowed directories
# This should go after the allowed directories
**/*~
**/*.log
**/.DS_Store
**/Thumbs.db
```

---

# Optimize

***

## Limit memory

By default, any Docker Container may consume as much of the hardware such as CPU and RAM. Better to limit usages.

```bash
$ docker run -p 8080:3000 -m "300M" --memory-swap "1G" demo
```

***

## Environment Variables

Run with `NODE_ENV` set to production.

```bash
$ docker run -p 8080:3000 -e "NODE_ENV=production" demo
```

This is the way you would pass in secrets and other runtime configurations to your application as well.

***

## Tag Docker Images When Building

In order to properly manage and maintain a deterministic build and an audit trail of a container, it is critical to create a good tagging strategy.

```bash
$ docker  build -t appnamespace/app:0.0.1 .
```

***

## Minimize your image size

Using minimal node.js image, yarn and multi-stage builds

```docker
# Do the npm install or yarn install in the full image
FROM mhart/alpine-node:8
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production

# And then copy over node_modules, etc from that stage to
# the smaller base image
FROM mhart/alpine-node:base-8
WORKDIR /app
COPY --from=0 /app .
COPY ./src /app/src

EXPOSE 8080
CMD ["node", "src/server.js"]
```

See [https://hub.docker.com/r/mhart/alpine-node/](https://hub.docker.com/r/mhart/alpine-node/)

---

# Gracefull Shutdown

> We can speak about the graceful shutdown of our application, when all of the resources it used and all of the traffic and/or data processing what it handled are closed and released properly.

***

## Long running request

A small simulation

```js
app.get('/wait', (req, res) => {
  const timeout = 5;
  console.log(`received request, waiting ${timeout} seconds`);
  setTimeout(() => {
    res.send({
      id: Date.now(),
      message: 'Hello belated world'});
  }, timeout * 1000)
})
```

If you stop the nodeJS server (ctrl-C or kill) before the request is finished.

```bash
$ curl http://localhost:8080/wait
curl: (52) Empty reply from server
```

***

## Gracefull Shutdown

React to sigint & sigterm to handle shutdown of the server

```js
const shutdown = (signal) => {
  console.log("shutdown by", signal);
  httpServer.close((err) => {
    console.log(`  server stopped by ${signal}`);
    process.exit(err ? 1 : 0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));   // ctrl-c
process.on('SIGTERM', () => shutdown('SIGTERM')); // kill
```

Limit Keep Alive

```js
const httpServer = app.listen(8080, () => {
    // limit keep alive to 6sec
    httpServer.timeout = 6000;
})
```

For production: https://www.npmjs.com/package/@moebius/http-graceful-shutdown

***


## Run in docker

Build and run

```bash
docker build -q -t grace . && docker run -p 1234:8080 --rm --name=grace grace
```

Stop container

```bash
docker stop grace
```

> BAD: We don't see any signal handling!

Lets look at the process tree.

```bash
$ docker exec -it grace /bin/sh
> ps falx
F   UID   PID  PPID COMMAND
4     0    24     0  /bin/sh
0     0    39    24   \_ ps falx
4     0     1     0  npm
4     0    17     1  sh -c node ./src/server.js
4     0    18    17  \_ node ./src/server.js
```

## Gracefull Docker Shutdown

To shutdown gracefully

```docker
# Don't start with npm
# Always start node process directly
CMD [ "node", "src/server.js" ]
EXPOSE 8080
```

Stop with timeout

```bash
# stop container with 30 timeout before sending KILL
docker stop grace --time 30
```

Build, run & shutdown

```bash
$ docker build -q -t grace . && docker run -p 1234:8080 --rm --name=grace grace
Shutdown by SIGTERM
  server stopped.
```

---

# Cluster node applications

> Set up high availability

***

# Clustering with PM2
> High available application

<img src="https://go.gliffy.com/go/share/image/s6a82dwxoaxlkesqscp2.png?utm_medium=live-embed&utm_source=trello">

***

## Setup, Config and Run PM2

Install

```bash
# install
npm install pm2 -g
```

Config

```js
# pm2.config.js
module.exports = {
  apps : [{
    name      : 'API',
    script    : './src/server.js',
    instances: "auto",
    kill_timeout: 10000,
    instance_var: 'PM2_INSTANCE_ID',
    exec_mode: 'cluster',
  }],
};
```

Startup & monitor

```bash
# Start PM2 demon
pm2 start pm2.config.js

# Other commands
pm2 status
pm2 logs
```

***

## Running PM2 in docker

```docker
# Dockerfile
FROM keymetrics/pm2:latest-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json /app/
COPY ecosystem.config.js /app/
RUN npm install --production --quiet

# Bundle app source
COPY . /app/

# Start app
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]

EXPOSE 8080
```

***

## Usefull PM2 commands

Usefull commands

```bash
# Listing managed processes
$ docker exec -it <container-id> pm2 list

# Monitoring CPU/Usage of each process
$ docker exec -it <container-id> pm2 monit
```

***

# Load Balancing with NGINX
## Multiple docker images

Let's configure an instance of NGINX to load balance requests between different docker instances.

<img src="https://go.gliffy.com/go/share/image/s76fla75pcq21jlur1s7.png?utm_medium=live-embed&utm_source=trello">

***

## Docker-compose

Compose is a tool for defining and running multi-container Docker applications.

```docker
version: '2'
services:
  nginx:
    build: ./nginx
    ports:
    - "8080:80"
    depends_on:
    - node1
    - node2
  node1:
    build: .
    depends_on:
    - mongo
    environment:
      MONGO_URL: mongodb://mongo/todoDemo
  node2:
    build: .
    depends_on:
    - mongo
    environment:
      MONGO_URL: mongodb://mongo/todoDemo
  mongo:
    image: mongo:3.2
    volumes:
    - ./.mongo-data:/data/db
```

***

## NGINX

[Nginx](https://www.nginx.com/) is a high performance load balancer.

nginx.conf

```
server {
  listen 80;

  location / {
    proxy_pass http://node-app;
  }
}

upstream node-app {
    server node1:3000 weight=10 max_fails=3 fail_timeout=30s;
    server node2:3000 weight=10 max_fails=3 fail_timeout=30s;
}
```

***

## Dockerize NGINX

Dockerfile

```
FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

***

## Compose: build and run

```bash
# build all docker images defined in the docker-compose file
$ docker-compose build

# startup docker cluster
$ docker-compose up
```

---

# Appendix
> Good to know

***

# Best practices for writing Dockerfiles

- Use a .dockerignore file
- Use multi-stage builds
    - Install tools you need to build your application
    - Install or update library dependencies
    - Generate your application
- Avoid installing unnecessary packages
- Each container should have only one concern (one process per container)
- Minimize the number of layers

***

# Usefull Docker Commands

```bash
# Docker build
docker build -t node-app .

# List all running containers
docker ps

# List all running docker containers
docker ps

# Remove all dangling images, temp/cached containers
docker system prune

# Stop all containers
docker stop $(docker ps -a -q)

# Remove all containers
docker rm $(docker ps -a -q)

# Remove/delete all images
docker rmi -f $(docker images -q)

# Stop (and after 10sec kill) a docker container
docker kill <container-id>

# Run interactive
docker run -p 8082:8080 -d <image-name> -i -t /bin/bash

# Run interactive on running container
docker exec -it <container-id> /bin/bash
```

***

# Resources

- [Using Yarn with Docker](https://hackernoon.com/using-yarn-with-docker-c116ad289d56)
- [Why we switched from docker to serverless](https://serverless.com/blog/why-we-switched-from-docker-to-serverless/)
- [Load Balancing Node.js Applications with NGINX and Docker](https://auth0.com/blog/load-balancing-nodejs-applications-with-nginx-and-docker/)
- [Best practices for writing Dockerfiles](
https://docs.docker.com/v17.09/engine/userguide/eng-image/dockerfile_best-practices)

- [Using PM2 with Docker](https://pm2.io/doc/en/runtime/integration/docker/?utm_source=pm2&utm_medium=website&utm_campaign=rebranding)

- [Building Graceful Node Applications in Docker](https://medium.com/@becintec/building-graceful-node-applications-in-docker-4d2cd4d5d392)

- [https://medium.com/dailyjs/how-to-prevent-your-node-js-process-from-crashing-5d40247b8ab2](https://medium.com/dailyjs/how-to-prevent-your-node-js-process-from-crashing-5d40247b8ab2)
- [How to write faster, leaner Dockerfiles for Node with Yarn and Alpine](https://medium.com/@iamnayr/a-multi-part-analysis-of-node-docker-image-sizes-using-yarn-vs-traditional-npm-2c20f034c08f)
- [https://medium.com/@gchudnov/trapping-signals-in-docker-containers-7a57fdda7d86](https://medium.com/@gchudnov/trapping-signals-in-docker-containers-7a57fdda7d86)




