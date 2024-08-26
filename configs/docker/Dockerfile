# Use the official Node.js image as base
FROM node:18-alpine as build

# Set the working directory
WORKDIR /back

# Copy package.json and package-lock.json to the working directory
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig*.json ./

# Install NestJS dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 3337

CMD ["npm", "run", "start:dev"]
