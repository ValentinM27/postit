FROM node:18-alpine

# Install build tools and bcrypt dependencies
RUN apk add --no-cache make gcc g++ python3

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Install dependancies
RUN npm install

# Rebuild bcrypt inside the container
RUN npm rebuild bcrypt --build-from-source

# Bundle app source
COPY . .

# Expose the app's port
EXPOSE 3000

# Run the app in development mode with hot reloading
CMD [ "yarn", "dev" ]
