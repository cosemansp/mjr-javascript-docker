FROM mhart/alpine-node:latest
LABEL name "now-docker"

RUN mkdir /app
WORKDIR /app
ADD package.json yarn.lock /app/
RUN yarn
COPY index.js /app

EXPOSE 3000
CMD ["node", "./node_modules/.bin/micro"]


