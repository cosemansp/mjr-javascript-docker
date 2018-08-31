# Dockerfile
FROM node

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json /app/
RUN npm install --production --quiet

# Bundle app source
COPY . /app

# Start app
CMD [ "node", "./src/index.js" ]
EXPOSE 3000
