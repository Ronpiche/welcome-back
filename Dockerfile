# Use the official Node.js image as base
FROM node:18-alpine

# Set the working directory
WORKDIR /code

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install NestJS dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS project
RUN npm run build

CMD [ "npm", "run", "start:prod" ]
