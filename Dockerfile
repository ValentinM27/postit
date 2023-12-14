FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Install dependancies
RUN npm install

# Bundle app source
COPY . .

# Set environment variable
ENV NODE_ENV=production

# Build the app
RUN npm run build

# TRAEFIK
LABEL "traefik.enable"="true" \
      "traefik.http.routers.thearchiver.rule"="Host(`archiver.valentinmarguerie.fr`)" \
      "traefik.http.routers.thearchiver.entrypoints"="websecure" \
      "traefik.http.services.thearchiver.loadbalancer.server.port"="3000"

# Expose the app's port
EXPOSE 3000

# Run the app
CMD [ "npm", "run", "start" ]