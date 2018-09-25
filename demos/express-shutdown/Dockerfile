# Dockerfile
FROM mhart/alpine-node

# set our node environment, either development or production
# defaults to production
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# default to port 80 for node
ARG PORT=80
ENV PORT $PORT
EXPOSE $PORT

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json /app/
RUN npm install --production --quiet

# check every 30s to ensure this service returns HTTP 200
HEALTHCHECK --interval=30s CMD node healthcheck.js

# Bundle app source
# copy in our source code last, as it changes the most
COPY . /app

# Start app
CMD [ "npm", "start" ]
# CMD [ "node", "src/server.js" ]
