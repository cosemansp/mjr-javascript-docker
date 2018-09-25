# Demo Walkthrough

## Startup

```
# cleanup all
docker system prune --all
```

- Open terminal, and resize
- Test download speed: ```docker run mhart/alpine-node node --version```

## MongoDB from Docker

```
# run docker image (you can only do this once)
docker run -p 27017:27017 --name mongodb --volume /data/docker/mongo-3.6:/bitnami --rm bitnami/mongodb:3.6

# show running docker instance
docker ps

# show downloaded/create images
docker image

# run mongoshell
docker exec -it mongodb mongo
```

--------

## First JS App

```
# demo
cd .../demos/http

# build
docker build -t node-app .

# run
docker run -p 8081:8080 -d node-app

# run interactive
docker run -p 8081:8080 -it node-app

# Try to stop ctrl-c
docker stop <containerID>
```

--------

## Dependencies

```
# demo
cd .../demos/express

# Build and run
docker build -t node-express .

# Show cached layer by changing code & rebuild
docker run -p 8081:8080 --rm -it node-express
```

--------

## Smaller image

```
# demo
cd .../demos/express

# change base image to: mhart/alpine-node
docker build -t node-express-alpine .

# use mhart/alpine-node:base
```

--------

## Multi-stage

```
# demo
cd .../demos/multi-staged
docker build -t multi .
docker images # see sizes
docker run -p 8081:8080 --rm -d multi
```

--------

## Health-check

```
# demo
cd .../demos/express-healthcheck

# build
docker build -t health .
docker run -p 8081:8080 --rm -d health
docker ps
docker kill <containerID>
```

--------

## Health-check

```
# demo
cd .../demos/express-shutdown

# run in console & ctrl-c during long call
yarn start

# fix in server.js
yarn start

# build & run in docker
docker build -t shutdown .
docker run -p 8080:80 --rm --name=appShutdown shutdown

# fix
CMD [ "node", "src/server.js" ]
```

--------

## PM2

```
# demo
cd .../demos/pm2

# show config & crash handler
# run local & crash
yarn start

# start pm2
pm2 start pm2.config.js

# crash again -> keeps running

# put it in docker
docker build -t node-pm2 .
docker run -p 8081:8080 --rm -d node-pm2
docker stop <containerId>
```

--------

## Nginx

```
# demo
cd .../demos/docker-compose

# show config & DockerFile
docker-compose build
docker-compose up
docker images
```

--------

## Deploy

```
# demo
cd .../demos/express-shutdown

# build with namespace & tag
docker build -t euri/my-image:1.0.1 .
docker push euri/my-image:1.0.1

# Azure - Create container
az container create --name euritest \
    --image euri/test:1.0.0 \
    --resource-group timACI --ip-address public --port 3000

# Azure - Start container
az container show --name euritest --resource-group timACI

# Azure - Delete container
az container delete --name euritest --resource-group timACI
```








