# Use the official Node.js image as base
FROM node:18-alpine

# Add environment variable
ENV NODE_ENV=production

# Set the working directory
WORKDIR /code

# Copy the application
COPY . ./

# Install NestJS dependencies
RUN npm ci --ignore-scripts

# Build the NestJS project
RUN npm run build

# Command to run the application
CMD ["npm", "run", "start:prod"]