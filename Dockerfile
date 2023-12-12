FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Install dependancies
RUN npm install

# Bundle app source
COPY . .

# Set environment variable during build
ARG BUCKET_NAME
ENV BUCKET_NAME=${BUCKET_NAME}

# Build the app
RUN npm run build

# Expose the app's port
EXPOSE 3000

# Run the app
CMD [ "npm", "run", "start" ]
